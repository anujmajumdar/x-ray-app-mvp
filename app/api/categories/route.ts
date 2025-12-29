import { NextResponse } from 'next/server';
import { categories } from '@/lib/data/categories';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    
    let filteredCategories = categories;
    
    if (categoryId) {
      filteredCategories = categories.filter(cat => cat.id === categoryId);
    }
    
    // Return serializable version (without functions)
    const serializableCategories = filteredCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      keywordsRules: cat.keywordsRules.map(rule => ({
        condition: rule.condition.toString(), // Serialize function as string
        keywords: rule.keywords
      })),
      defaultKeywords: cat.defaultKeywords,
      mockCandidatesRules: cat.mockCandidatesRules.map(rule => ({
        condition: rule.condition.toString(), // Serialize function as string
        candidates: rule.candidates
      })),
      defaultCandidates: cat.defaultCandidates
    }));
    
    return NextResponse.json({
      success: true,
      count: serializableCategories.length,
      categories: serializableCategories
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

