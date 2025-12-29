export type StepType = 'llm' | 'api' | 'filter' | 'ranking' | 'generic';

export interface Evaluation {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
  metadata?: any;
}

export interface TraceStep {
  id: string;
  name: string;
  type: StepType;
  input: any;
  output: any;
  reasoning: string;
  evaluations?: Evaluation[];
  durationMs: number;
  timestamp: string;
}

export interface Trace {
  id: string;
  workflowName: string;
  initialInput: any;
  steps: TraceStep[];
  status: 'success' | 'failed';
  createdAt: string;
}

export class XRayClient {
  private steps: TraceStep[] = [];
  private startTime: number;

  constructor(private workflowName: string, private initialInput: any) {
    this.startTime = Date.now();
  }

  async step<T>(
    params: { name: string; type: StepType; input: any },
    execution: (logger: { 
      logReasoning: (msg: string) => void; 
      logEval: (evaluation: Evaluation) => void 
    }) => Promise<T>
  ): Promise<T> {
    const stepStartTime = Date.now();
    let reasoning = "";
    const evaluations: Evaluation[] = [];

    try {
      const output = await execution({
        logReasoning: (msg) => { reasoning = msg; },
        logEval: (evalItem) => { evaluations.push(evalItem); }
      });

      this.steps.push({
        id: Math.random().toString(36).substring(7),
        ...params,
        output,
        reasoning,
        evaluations: evaluations.length > 0 ? evaluations : undefined,
        durationMs: Date.now() - stepStartTime,
        timestamp: new Date().toISOString(),
      });

      return output;
    } catch (error: any) {
      // Logic for capturing failure context
      this.steps.push({
        id: Math.random().toString(36).substring(7),
        ...params,
        output: { error: error.message },
        reasoning: `Step failed: ${error.message}`,
        durationMs: Date.now() - stepStartTime,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  getPayload(): Trace {
    // Generate a more unique ID using timestamp + random string
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    const uniqueId = `${timestamp}-${random}`.toUpperCase();
    
    // Check if any step failed (has error in output)
    const hasFailure = this.steps.some(step => 
      step.output && typeof step.output === 'object' && step.output.error
    );
    
    return {
      id: uniqueId,
      workflowName: this.workflowName,
      initialInput: this.initialInput,
      steps: this.steps,
      status: hasFailure ? 'failed' : 'success',
      createdAt: new Date().toISOString(),
    };
  }

  async submit() {
    const payload = this.getPayload();
    // In this MVP, we call our own internal API
    // Check if we're in a server context (no window object)
    if (typeof window === 'undefined') {
      // Server-side: import and use storage directly
      const { storage } = await import('./storage');
      
      // Check for duplicate ID and make unique if needed
      const existingIndex = storage.findIndex((t: any) => t.id === payload.id);
      if (existingIndex >= 0) {
        const timestamp = Date.now().toString(36);
        payload.id = `${payload.id}-${timestamp}`.toUpperCase();
        console.log(`Duplicate ID detected, new ID: ${payload.id}`);
      }
      
      // Always append (never overwrite)
      storage.push(payload);
      console.log(`Trace saved to storage: ${payload.id}, total traces: ${storage.length}`);
    } else {
      // Client-side: use fetch
      const response = await fetch('/api/traces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error('Failed to save trace via API');
      }
    }
    return payload;
  }
}