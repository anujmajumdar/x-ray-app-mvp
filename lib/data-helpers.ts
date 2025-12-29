// Helper functions to reconstruct category configurations from API data
import { TestCase } from './data/test-cases';
import { CategoryConfig } from './data/categories';

export interface ProductCategory {
  name: string;
  testCases: TestCase[];
  keywords: (prospect: TestCase) => string[];
  mockCandidates: (prospect: TestCase) => any[];
}

export function buildCategoryFromConfig(
  categoryConfig: CategoryConfig,
  testCases: TestCase[]
): ProductCategory {
  // Filter test cases for this category
  const categoryTestCases = testCases.filter(tc => tc.categoryId === categoryConfig.id);
  
  // Build keywords function
  const keywords = (prospect: TestCase): string[] => {
    for (const rule of categoryConfig.keywordsRules) {
      if (rule.condition(prospect)) {
        return rule.keywords;
      }
    }
    return categoryConfig.defaultKeywords;
  };
  
  // Build mockCandidates function
  const mockCandidates = (prospect: TestCase): any[] => {
    for (const rule of categoryConfig.mockCandidatesRules) {
      if (rule.condition(prospect)) {
        return rule.candidates;
      }
    }
    return categoryConfig.defaultCandidates;
  };
  
  return {
    name: categoryConfig.name,
    testCases: categoryTestCases,
    keywords,
    mockCandidates
  };
}

export async function fetchTestCases(categoryId?: string): Promise<TestCase[]> {
  const url = categoryId 
    ? `/api/test-cases?categoryId=${categoryId}`
    : '/api/test-cases';
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch test cases');
  }
  
  return data.testCases;
}

export async function fetchCategories(categoryId?: string): Promise<CategoryConfig[]> {
  const url = categoryId
    ? `/api/categories?categoryId=${categoryId}`
    : '/api/categories';
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  
  return data.categories;
}

