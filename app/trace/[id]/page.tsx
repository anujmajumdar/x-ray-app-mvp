"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Fixed import

export default function TraceDetail() {
  const params = useParams();
  const id = params.id; // Accessing the [id] from the URL
  const [trace, setTrace] = useState<any>(null);

  useEffect(() => {
    // Fetching the data from our memory store API
    fetch('/api/traces')
      .then((res) => res.json())
      .then((all) => {
        const found = all.find((t: any) => t.id === id);
        setTrace(found);
      });
  }, [id]);

  if (!trace) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium">Loading execution context...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline mb-6 block">
          ← Back to executions
        </Link>
        
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{trace.workflowName}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>Trace ID: <b className="font-mono text-slate-700">{trace.id}</b></span>
            <span>•</span>
            <span>Status: 
              {trace.status === 'failed' ? (
                <span className="text-red-600 font-bold uppercase text-xs ml-1">Failed</span>
              ) : (
                <span className="text-green-600 font-bold uppercase text-xs ml-1">Success</span>
              )}
            </span>
          </div>
        </header>

        <div className="space-y-12 relative">
          {/* Vertical Timeline Path */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          {trace.steps.map((step: any, idx: number) => {
            const stepFailed = step.output && typeof step.output === 'object' && step.output.error;
            const isLastStep = idx === trace.steps.length - 1;
            const isFailureStep = stepFailed && (trace.status === 'failed');
            
            return (
            <div key={idx} className="relative pl-16">
              {/* Timeline Node */}
              <div className={`absolute left-4.5 top-0 w-8 h-8 rounded-full bg-white border-4 z-10 flex items-center justify-center text-xs font-bold shadow-sm ${
                stepFailed ? 'border-red-500' : 'border-indigo-500'
              }`}>
                {idx + 1}
              </div>

              <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                stepFailed ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
              }`}>
                <div className={`p-4 border-b flex justify-between items-center ${
                  stepFailed ? 'bg-red-50/50 border-red-100' : 'bg-slate-50/50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{step.name}</h3>
                    {stepFailed && (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                        Failed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-200 rounded text-slate-600">
                    {step.type}
                  </span>
                </div>

                <div className="p-6">
                  {/* Error Display */}
                  {stepFailed && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-[10px] font-bold text-red-600 uppercase mb-1 tracking-wider">Error</p>
                      <p className="text-red-800 leading-relaxed font-medium text-sm">{step.output.error}</p>
                    </div>
                  )}
                  
                  {/* Reasoning Logic - The "Why" */}
                  {step.reasoning && (
                    <div className={`mb-6 p-4 rounded-xl border ${
                      stepFailed ? 'bg-red-50/50 border-red-100' : 'bg-indigo-50 border-indigo-100'
                    }`}>
                      <p className={`text-[10px] font-bold uppercase mb-1 tracking-wider ${
                        stepFailed ? 'text-red-400' : 'text-indigo-400'
                      }`}>Reasoning Context</p>
                      <p className="text-slate-700 leading-relaxed font-medium text-sm">"{step.reasoning}"</p>
                    </div>
                  )}

                  {/* Filter Logic Visualization */}
                  {step.evaluations && (
                    <div className="mt-4 border rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="p-3 font-semibold">Candidate Item</th>
                            <th className="p-3 font-semibold">Outcome</th>
                            <th className="p-3 font-semibold">Reason for Decision</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {step.evaluations.map((e: any, i: number) => (
                            <tr key={i} className={e.passed ? "" : "bg-red-50/20"}>
                              <td className="p-3 font-medium text-slate-700">{e.label}</td>
                              <td className="p-3">
                                {e.passed ? 
                                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-[10px]">PASSED</span> : 
                                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold text-[10px]">DROPPED</span>}
                              </td>
                              <td className="p-3 text-slate-500 italic">{e.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Step Metadata */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex gap-6">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Input Context</p>
                      <pre className="text-[10px] p-3 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto">
                        {JSON.stringify(step.input, null, 2)}
                      </pre>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Output Result</p>
                      <pre className="text-[10px] p-3 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}