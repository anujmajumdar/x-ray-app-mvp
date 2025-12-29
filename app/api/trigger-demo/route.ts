import { NextResponse } from 'next/server';
import { runCompetitorSelection } from '@/lib/demo-workflow';
import { demoTestCases } from '@/lib/demo-test-cases';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { categoryIndex, testCaseIndex, mode } = body;
    
    // If specific category and test case are provided, run only that one
    if (typeof categoryIndex === 'number' && typeof testCaseIndex === 'number') {
      const category = demoTestCases[categoryIndex];
      if (!category || !category.testCases[testCaseIndex]) {
        return NextResponse.json(
          { success: false, error: 'Invalid category or test case index' },
          { status: 400 }
        );
      }
      
      const testCase = category.testCases[testCaseIndex];
      const trace = await runCompetitorSelection(testCase, category);
      
      return NextResponse.json({ 
        success: true, 
        traceId: trace.id,
        category: category.name,
        testCase: testCase.title
      });
    }
    
    // Collect all test cases
    const allTestCases: Array<{ category: typeof demoTestCases[0], testCase: typeof demoTestCases[0]['testCases'][0] }> = [];
    for (let catIdx = 0; catIdx < demoTestCases.length; catIdx++) {
      const category = demoTestCases[catIdx];
      for (let testIdx = 0; testIdx < category.testCases.length; testIdx++) {
        allTestCases.push({ category, testCase: category.testCases[testIdx] });
      }
    }
    
    // Handle random mode
    let testCasesToRun = allTestCases;
    if (mode === 'random') {
      // Select 1 random test case
      const randomIndex = Math.floor(Math.random() * allTestCases.length);
      testCasesToRun = [allTestCases[randomIndex]];
    }
    
    // Run test cases (all or random subset)
    const results = [];
    
    for (const { category, testCase } of testCasesToRun) {
      try {
        console.log(`Running test case: ${testCase.title} from ${category.name}`);
        const trace = await runCompetitorSelection(testCase, category);
        console.log(`Trace created: ${trace.id}`);
        
        results.push({
          success: true,
          traceId: trace.id,
          category: category.name,
          testCase: testCase.title
        });
        
        // Small delay between runs to ensure unique timestamps and avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`Error running test case ${testCase.title}:`, error);
        results.push({
          success: false,
          category: category.name,
          testCase: testCase.title,
          error: error.message
        });
      }
    }
    
    // Import storage to verify traces were saved
    const { storage } = await import('@/lib/storage');
    console.log(`Total traces in storage: ${storage.length}`);
    
    return NextResponse.json({ 
      success: true, 
      mode: mode || 'all',
      totalRun: results.length,
      successful: results.filter(r => r.success).length,
      totalTracesInStorage: storage.length,
      results 
    });
  } catch (error: any) {
    console.error('Demo workflow error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

