import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(req: Request) {
  const trace = await req.json();
  
  // Check if trace with same ID already exists (prevent duplicates)
  const existingIndex = storage.findIndex((t: any) => t.id === trace.id);
  
  if (existingIndex >= 0) {
    // If duplicate ID found, append a suffix to make it unique
    const timestamp = Date.now().toString(36);
    trace.id = `${trace.id}-${timestamp}`.toUpperCase();
    console.log(`Duplicate ID detected in API, new ID: ${trace.id}`);
  }
  
  // Always append new traces (never overwrite)
  storage.push(trace);
  console.log(`Trace saved via API: ${trace.id}, total traces: ${storage.length}`);
  
  return NextResponse.json({ success: true, traceId: trace.id });
}

export async function GET() {
  // Return traces in reverse order (newest first) without modifying the array
  const traces = [...storage].reverse();
  console.log(`GET /api/traces: Returning ${traces.length} traces`);
  return NextResponse.json(traces);
}