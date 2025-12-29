import { NextResponse } from 'next/server';
import { testCases } from '@/lib/data/test-cases';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    
    let filteredCases = testCases;
    
    if (categoryId) {
      filteredCases = testCases.filter(tc => tc.categoryId === categoryId);
    }
    
    return NextResponse.json({
      success: true,
      count: filteredCases.length,
      testCases: filteredCases
    });
  } catch (error: any) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

