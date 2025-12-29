// Server-side helper functions to load data directly (for use in API routes and server components)
import { testCases } from './data/test-cases';
import { categories } from './data/categories';
import { TestCase } from './data/test-cases';
import { CategoryConfig } from './data/categories';
import { ProductCategory, buildCategoryFromConfig } from './data-helpers';

export function getTestCases(categoryId?: string): TestCase[] {
  if (categoryId) {
    return testCases.filter(tc => tc.categoryId === categoryId);
  }
  return testCases;
}

export function getCategories(categoryId?: string): CategoryConfig[] {
  if (categoryId) {
    return categories.filter(cat => cat.id === categoryId);
  }
  return categories;
}

export function getCategoryByName(name: string): CategoryConfig | undefined {
  return categories.find(cat => cat.name === name);
}

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find(cat => cat.id === id);
}

export function buildAllCategories(): ProductCategory[] {
  return categories.map(categoryConfig => 
    buildCategoryFromConfig(categoryConfig, testCases)
  );
}

export function getCategoryWithTestCases(categoryId: string): ProductCategory | undefined {
  const categoryConfig = getCategoryById(categoryId);
  if (!categoryConfig) return undefined;
  
  return buildCategoryFromConfig(categoryConfig, testCases);
}

