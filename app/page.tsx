// app/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [traces, setTraces] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/traces');
      const data = await res.json();
      console.log(`Loaded ${data.length} traces`);
      setTraces(data);
    } catch (error) {
      console.error('Error loading traces:', error);
      setTraces([]);
    }
  };

  const triggerDemo = async (mode: 'all' | 'random' = 'all') => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/trigger-demo', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Demo result:', result);
      
      if (result.success) {
        // For "all" mode, wait longer since there are 20 test cases
        // For "random" mode, wait shorter since it's just 1 test case
        const waitTime = mode === 'all' ? 5000 : 1500;
        
        // Reload immediately, then again after wait time to catch any delayed saves
        load();
        
        setTimeout(() => {
          load();
          setIsRunning(false);
        }, waitTime);
      } else {
        console.error('Demo failed:', result.error);
        setIsRunning(false);
        alert(`Demo failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error running demo:', error);
      setIsRunning(false);
      alert(`Error: ${error.message || 'Failed to run demo'}`);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">X-Ray Dashboard</h1>
            <p className="text-gray-500">Observability for algorithmic decision pipelines</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => triggerDemo('random')}
              disabled={isRunning}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Random (1 case)'}
            </button>
            <button 
              onClick={() => triggerDemo('all')}
              disabled={isRunning}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running All Test Cases...' : 'Run All (20 cases)'}
            </button>
          </div>
        </header>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Test Cases:</strong> 5 product categories × 4 test cases each = 20 total test cases
            <br />
            Categories: Water Bottles, Laptops, Headphones, Smart Watches, Gaming Keyboards
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {traces.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg mb-2">No execution traces yet</p>
              <p className="text-sm">Click "Run All Demo Test Cases" to generate traces</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Execution ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Workflow / Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Steps</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {traces.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600">
                      <Link href={`/trace/${t.id}`} className="hover:underline">{t.id}</Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.workflowName}</td>
                    <td className="px-6 py-4">
                      {t.status === 'failed' ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs uppercase">Failed</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs uppercase">Success</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{t.steps.length} steps</td>
                    <td className="px-6 py-4 text-gray-600">
                      {t.steps.reduce((acc: number, s: any) => acc + s.durationMs, 0)}ms
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(t.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}