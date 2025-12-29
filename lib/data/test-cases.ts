// Test cases data storage
export interface TestCase {
  id: string;
  title: string;
  price: number;
  category: string;
  categoryId: string;
  failureStep?: 1 | 2 | 3 | 4 | 5; // Optional: which step should fail (1=keywords, 2=API, 3=filter, 4=LLM eval, 5=ranking)
  failureReason?: string; // Optional: reason for failure
}

export const testCases: TestCase[] = [
  // Water Bottles & Drinkware
  { id: 'WB-1', title: "Stanley Adventure Quencher Travel Tumbler 40oz", price: 44.99, category: "Water Bottles & Drinkware", categoryId: "water-bottles" },
  { id: 'WB-2', title: "HydroFlask Wide Mouth Water Bottle 32oz", price: 39.95, category: "Water Bottles & Drinkware", categoryId: "water-bottles", failureStep: 1, failureReason: "LLM service timeout - unable to generate keywords" },
  { id: 'WB-3', title: "Yeti Rambler Insulated Bottle 26oz", price: 45.00, category: "Water Bottles & Drinkware", categoryId: "water-bottles", failureStep: 2, failureReason: "API rate limit exceeded - search service unavailable" },
  { id: 'WB-4', title: "CamelBak Chute Mag Water Bottle 32oz", price: 24.99, category: "Water Bottles & Drinkware", categoryId: "water-bottles", failureStep: 4, failureReason: "LLM evaluation service overloaded - unable to process relevance checks" },
  
  // Laptops & Computers
  { id: 'LP-1', title: "MacBook Pro 14-inch M3 Pro 512GB", price: 1999.00, category: "Laptops & Computers", categoryId: "laptops", failureStep: 2, failureReason: "Database connection error - unable to retrieve product catalog" },
  { id: 'LP-2', title: "Dell XPS 13 Plus 512GB SSD", price: 1299.99, category: "Laptops & Computers", categoryId: "laptops" },
  { id: 'LP-3', title: "Lenovo ThinkPad X1 Carbon Gen 11", price: 1499.00, category: "Laptops & Computers", categoryId: "laptops", failureStep: 3, failureReason: "Filter criteria too strict - all candidates eliminated" },
  { id: 'LP-4', title: "HP Spectre x360 14-inch 2-in-1", price: 1199.99, category: "Laptops & Computers", categoryId: "laptops", failureStep: 5, failureReason: "Ranking algorithm error - unable to compute composite scores" },
  
  // Wireless Headphones
  { id: 'HP-1', title: "Sony WH-1000XM5 Noise Cancelling Headphones", price: 399.99, category: "Wireless Headphones", categoryId: "headphones" },
  { id: 'HP-2', title: "Bose QuietComfort 45 Wireless", price: 329.99, category: "Wireless Headphones", categoryId: "headphones", failureStep: 1, failureReason: "LLM API authentication failed - service unavailable" },
  { id: 'HP-3', title: "Apple AirPods Max", price: 549.99, category: "Wireless Headphones", categoryId: "headphones", failureStep: 4, failureReason: "LLM evaluation timeout - relevance check service unresponsive" },
  { id: 'HP-4', title: "Sennheiser Momentum 4 Wireless", price: 379.99, category: "Wireless Headphones", categoryId: "headphones", failureStep: 2, failureReason: "Search index corrupted - unable to query product database" },
  
  // Smart Watches
  { id: 'SW-1', title: "Apple Watch Series 9 GPS 45mm", price: 429.99, category: "Smart Watches", categoryId: "smart-watches", failureStep: 2, failureReason: "Product database maintenance - search service temporarily unavailable" },
  { id: 'SW-2', title: "Samsung Galaxy Watch 6 Classic 47mm", price: 399.99, category: "Smart Watches", categoryId: "smart-watches" },
  { id: 'SW-3', title: "Garmin Forerunner 265", price: 449.99, category: "Smart Watches", categoryId: "smart-watches", failureStep: 3, failureReason: "Business rules too restrictive - all candidates eliminated" },
  { id: 'SW-4', title: "Fitbit Versa 4", price: 199.99, category: "Smart Watches", categoryId: "smart-watches", failureStep: 5, failureReason: "Ranking service database error - composite score calculation failed" },
  
  // Gaming Keyboards
  { id: 'KB-1', title: "Razer BlackWidow V4 Pro Mechanical Keyboard", price: 229.99, category: "Gaming Keyboards", categoryId: "gaming-keyboards", failureStep: 1, failureReason: "LLM token limit exceeded - unable to process product title" },
  { id: 'KB-2', title: "Corsair K70 RGB TKL Mechanical", price: 169.99, category: "Gaming Keyboards", categoryId: "gaming-keyboards" },
  { id: 'KB-3', title: "Logitech G915 TKL Wireless", price: 229.99, category: "Gaming Keyboards", categoryId: "gaming-keyboards", failureStep: 4, failureReason: "LLM evaluation API quota exceeded - relevance analysis unavailable" },
  { id: 'KB-4', title: "SteelSeries Apex Pro TKL", price: 199.99, category: "Gaming Keyboards", categoryId: "gaming-keyboards", failureStep: 2, failureReason: "Search API timeout - external service unresponsive" },
];

