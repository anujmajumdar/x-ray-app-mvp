import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

interface ErrorLog {
  traceId: string;
  workflowName: string;
  stepId: string;
  stepName: string;
  stepType: string;
  errorMessage: string;
  timestamp: string;
  traceCreatedAt: string;
  stepDurationMs: number;
  stepInput: string;
  stepReasoning: string;
}

function extractErrorLogs(): ErrorLog[] {
  const errorLogs: ErrorLog[] = [];

  for (const trace of storage) {
    if (!trace.steps || !Array.isArray(trace.steps)) continue;

    for (const step of trace.steps) {
      // Check if step has an error
      if (step.output && typeof step.output === 'object' && step.output.error) {
        errorLogs.push({
          traceId: trace.id || 'unknown',
          workflowName: trace.workflowName || 'unknown',
          stepId: step.id || 'unknown',
          stepName: step.name || 'unknown',
          stepType: step.type || 'unknown',
          errorMessage: step.output.error || 'Unknown error',
          timestamp: step.timestamp || trace.createdAt || new Date().toISOString(),
          traceCreatedAt: trace.createdAt || new Date().toISOString(),
          stepDurationMs: step.durationMs || 0,
          stepInput: JSON.stringify(step.input || {}),
          stepReasoning: step.reasoning || '',
        });
      }
    }
  }

  return errorLogs;
}

function escapeCSVField(field: string): string {
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function convertToCSV(errorLogs: ErrorLog[]): string {
  if (errorLogs.length === 0) {
    return 'No error logs found';
  }

  // CSV Header
  const headers = [
    'Trace ID',
    'Workflow Name',
    'Step ID',
    'Step Name',
    'Step Type',
    'Error Message',
    'Step Timestamp',
    'Trace Created At',
    'Step Duration (ms)',
    'Step Input',
    'Step Reasoning'
  ];

  // CSV Rows - escape all fields properly
  const rows = errorLogs.map(log => [
    escapeCSVField(log.traceId),
    escapeCSVField(log.workflowName),
    escapeCSVField(log.stepId),
    escapeCSVField(log.stepName),
    escapeCSVField(log.stepType),
    escapeCSVField(log.errorMessage),
    escapeCSVField(log.timestamp),
    escapeCSVField(log.traceCreatedAt),
    log.stepDurationMs.toString(), // Numeric field, no escaping needed
    escapeCSVField(log.stepInput),
    escapeCSVField(log.stepReasoning)
  ]);

  // Combine header and rows
  const csvLines = [headers.map(escapeCSVField).join(','), ...rows.map(row => row.join(','))];
  return csvLines.join('\n');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json'; // 'json' or 'csv'

    const errorLogs = extractErrorLogs();

    if (format === 'csv') {
      const csv = convertToCSV(errorLogs);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="error-logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else {
      // JSON format
      return NextResponse.json({
        metadata: {
          exportDate: new Date().toISOString(),
          totalErrors: errorLogs.length,
          format: 'json',
        },
        errors: errorLogs,
      }, {
        headers: {
          'Content-Disposition': `attachment; filename="error-logs-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }
  } catch (error: any) {
    console.error('Error exporting error logs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

