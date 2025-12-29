// Demo test cases organized by product category
export interface TestCase {
  title: string;
  price: number;
  category: string;
  failureStep?: 1 | 2 | 3 | 4 | 5; // Optional: which step should fail (1=keywords, 2=API, 3=filter, 4=LLM eval, 5=ranking)
  failureReason?: string; // Optional: reason for failure
}

export interface ProductCategory {
  name: string;
  testCases: TestCase[];
  mockCandidates: (prospect: TestCase) => any[];
  keywords: (prospect: TestCase) => string[];
}

export const demoTestCases: ProductCategory[] = [
  {
    name: "Water Bottles & Drinkware",
    testCases: [
      { title: "Stanley Adventure Quencher Travel Tumbler 40oz", price: 44.99, category: "Water Bottles & Drinkware" }, // Success
      { title: "HydroFlask Wide Mouth Water Bottle 32oz", price: 39.95, category: "Water Bottles & Drinkware", failureStep: 1, failureReason: "LLM service timeout - unable to generate keywords" }, // Fail at step 1
      { title: "Yeti Rambler Insulated Bottle 26oz", price: 45.00, category: "Water Bottles & Drinkware", failureStep: 2, failureReason: "API rate limit exceeded - search service unavailable" }, // Fail at step 2
      { title: "CamelBak Chute Mag Water Bottle 32oz", price: 24.99, category: "Water Bottles & Drinkware", failureStep: 4, failureReason: "LLM evaluation service overloaded - unable to process relevance checks" }, // Fail at step 4
    ],
    keywords: (prospect) => {
      if (prospect.title.toLowerCase().includes("stanley")) {
        return ["insulated travel tumbler", "stainless steel water bottle", "vacuum sealed drinkware"];
      }
      if (prospect.title.toLowerCase().includes("hydroflask")) {
        return ["wide mouth water bottle", "stainless steel flask", "insulated bottle"];
      }
      if (prospect.title.toLowerCase().includes("yeti")) {
        return ["insulated rambler bottle", "premium water bottle", "stainless steel flask"];
      }
      return ["water bottle 32oz", "insulated drinkware", "stainless steel bottle"];
    },
    mockCandidates: (prospect) => [
      { id: 'WB1', title: "HydroFlask 32oz Wide Mouth", price: 44.95, rating: 4.8, reviews: 15200 },
      { id: 'WB2', title: "Generic Plastic Bottle", price: 8.99, rating: 3.5, reviews: 12 },
      { id: 'WB3', title: "Yeti Rambler 30oz", price: 38.00, rating: 4.7, reviews: 9400 },
      { id: 'WB4', title: "CamelBak Chute Mag 32oz", price: 24.99, rating: 4.6, reviews: 3200 },
      { id: 'WB5', title: "Klean Kanteen Classic 32oz", price: 29.95, rating: 4.5, reviews: 2100 },
    ],
  },
  {
    name: "Laptops & Computers",
    testCases: [
      { title: "MacBook Pro 14-inch M3 Pro 512GB", price: 1999.00, category: "Laptops & Computers", failureStep: 2, failureReason: "Database connection error - unable to retrieve product catalog" }, // Fail at step 2
      { title: "Dell XPS 13 Plus 512GB SSD", price: 1299.99, category: "Laptops & Computers" }, // Success
      { title: "Lenovo ThinkPad X1 Carbon Gen 11", price: 1499.00, category: "Laptops & Computers", failureStep: 3, failureReason: "Filter criteria too strict - all candidates eliminated" }, // Fail at step 3
      { title: "HP Spectre x360 14-inch 2-in-1", price: 1199.99, category: "Laptops & Computers", failureStep: 5, failureReason: "Ranking algorithm error - unable to compute composite scores" }, // Fail at step 5
    ],
    keywords: (prospect) => {
      if (prospect.title.toLowerCase().includes("macbook")) {
        return ["premium laptop", "apple laptop", "professional notebook", "M3 processor"];
      }
      if (prospect.title.toLowerCase().includes("xps")) {
        return ["ultrabook", "dell laptop", "thin and light", "premium windows laptop"];
      }
      if (prospect.title.toLowerCase().includes("thinkpad")) {
        return ["business laptop", "lenovo notebook", "professional laptop", "enterprise laptop"];
      }
      return ["2-in-1 laptop", "convertible laptop", "touchscreen notebook"];
    },
    mockCandidates: (prospect) => [
      { id: 'LP1', title: "MacBook Air M2 13-inch 256GB", price: 1099.00, rating: 4.7, reviews: 8900 },
      { id: 'LP2', title: "Dell XPS 15 512GB", price: 1599.99, rating: 4.6, reviews: 4200 },
      { id: 'LP3', title: "ASUS ZenBook 14 OLED", price: 899.99, rating: 4.4, reviews: 1800 },
      { id: 'LP4', title: "Microsoft Surface Laptop 5", price: 999.99, rating: 4.5, reviews: 3100 },
      { id: 'LP5', title: "Acer Swift 3 14-inch", price: 649.99, rating: 4.2, reviews: 950 },
    ],
  },
  {
    name: "Wireless Headphones",
    testCases: [
      { title: "Sony WH-1000XM5 Noise Cancelling Headphones", price: 399.99, category: "Wireless Headphones" }, // Success
      { title: "Bose QuietComfort 45 Wireless", price: 329.99, category: "Wireless Headphones", failureStep: 1, failureReason: "LLM API authentication failed - service unavailable" }, // Fail at step 1
      { title: "Apple AirPods Max", price: 549.99, category: "Wireless Headphones", failureStep: 4, failureReason: "LLM evaluation timeout - relevance check service unresponsive" }, // Fail at step 4
      { title: "Sennheiser Momentum 4 Wireless", price: 379.99, category: "Wireless Headphones", failureStep: 2, failureReason: "Search index corrupted - unable to query product database" }, // Fail at step 2
    ],
    keywords: (prospect) => {
      if (prospect.title.toLowerCase().includes("sony")) {
        return ["noise cancelling headphones", "wireless over-ear", "premium audio", "bluetooth headphones"];
      }
      if (prospect.title.toLowerCase().includes("bose")) {
        return ["quietcomfort headphones", "noise cancelling", "wireless audio", "comfort headphones"];
      }
      if (prospect.title.toLowerCase().includes("airpods")) {
        return ["apple headphones", "premium wireless", "spatial audio", "over-ear headphones"];
      }
      return ["wireless headphones", "premium audio", "bluetooth over-ear", "high-end headphones"];
    },
    mockCandidates: (prospect) => [
      { id: 'HP1', title: "Sony WH-1000XM4", price: 349.99, rating: 4.8, reviews: 12500 },
      { id: 'HP2', title: "Bose QuietComfort 35 II", price: 299.99, rating: 4.6, reviews: 9800 },
      { id: 'HP3', title: "JBL Live 660NC", price: 149.99, rating: 4.3, reviews: 3200 },
      { id: 'HP4', title: "Audio-Technica ATH-M50xBT2", price: 199.99, rating: 4.5, reviews: 2100 },
      { id: 'HP5', title: "Beats Studio3 Wireless", price: 249.99, rating: 4.4, reviews: 5600 },
    ],
  },
  {
    name: "Smart Watches",
    testCases: [
      { title: "Apple Watch Series 9 GPS 45mm", price: 429.99, category: "Smart Watches", failureStep: 2, failureReason: "Product database maintenance - search service temporarily unavailable" }, // Fail at step 2
      { title: "Samsung Galaxy Watch 6 Classic 47mm", price: 399.99, category: "Smart Watches" }, // Success
      { title: "Garmin Forerunner 265", price: 449.99, category: "Smart Watches", failureStep: 3, failureReason: "Business rules too restrictive - all candidates eliminated" }, // Fail at step 3
      { title: "Fitbit Versa 4", price: 199.99, category: "Smart Watches", failureStep: 5, failureReason: "Ranking service database error - composite score calculation failed" }, // Fail at step 5
    ],
    keywords: (prospect) => {
      if (prospect.title.toLowerCase().includes("apple")) {
        return ["smartwatch", "apple watch", "fitness tracker", "wearable device"];
      }
      if (prospect.title.toLowerCase().includes("samsung")) {
        return ["galaxy watch", "android smartwatch", "wearable", "fitness watch"];
      }
      if (prospect.title.toLowerCase().includes("garmin")) {
        return ["running watch", "gps watch", "fitness tracker", "sports watch"];
      }
      return ["fitness tracker", "smartwatch", "activity tracker", "wearable"];
    },
    mockCandidates: (prospect) => [
      { id: 'SW1', title: "Apple Watch Series 8 GPS 41mm", price: 399.99, rating: 4.7, reviews: 11200 },
      { id: 'SW2', title: "Samsung Galaxy Watch 5 Pro", price: 449.99, rating: 4.6, reviews: 6800 },
      { id: 'SW3', title: "Garmin Venu 2 Plus", price: 449.99, rating: 4.8, reviews: 4200 },
      { id: 'SW4', title: "Fitbit Charge 6", price: 159.99, rating: 4.4, reviews: 5400 },
      { id: 'SW5', title: "Amazfit GTR 4", price: 199.99, rating: 4.3, reviews: 1800 },
    ],
  },
  {
    name: "Gaming Keyboards",
    testCases: [
      { title: "Razer BlackWidow V4 Pro Mechanical Keyboard", price: 229.99, category: "Gaming Keyboards", failureStep: 1, failureReason: "LLM token limit exceeded - unable to process product title" }, // Fail at step 1
      { title: "Corsair K70 RGB TKL Mechanical", price: 169.99, category: "Gaming Keyboards" }, // Success
      { title: "Logitech G915 TKL Wireless", price: 229.99, category: "Gaming Keyboards", failureStep: 4, failureReason: "LLM evaluation API quota exceeded - relevance analysis unavailable" }, // Fail at step 4
      { title: "SteelSeries Apex Pro TKL", price: 199.99, category: "Gaming Keyboards", failureStep: 2, failureReason: "Search API timeout - external service unresponsive" }, // Fail at step 2
    ],
    keywords: (prospect) => {
      if (prospect.title.toLowerCase().includes("razer")) {
        return ["mechanical gaming keyboard", "rgb keyboard", "gaming peripheral", "mechanical switches"];
      }
      if (prospect.title.toLowerCase().includes("corsair")) {
        return ["mechanical keyboard", "rgb backlit", "gaming keyboard", "cherry mx switches"];
      }
      if (prospect.title.toLowerCase().includes("logitech")) {
        return ["wireless gaming keyboard", "mechanical keyboard", "low profile", "rgb keyboard"];
      }
      return ["gaming keyboard", "mechanical keyboard", "rgb keyboard", "tenkeyless keyboard"];
    },
    mockCandidates: (prospect) => [
      { id: 'KB1', title: "Razer Huntsman V3 Pro", price: 249.99, rating: 4.7, reviews: 3200 },
      { id: 'KB2', title: "Corsair K95 RGB Platinum", price: 199.99, rating: 4.6, reviews: 4800 },
      { id: 'KB3', title: "Logitech G Pro X TKL", price: 149.99, rating: 4.5, reviews: 2100 },
      { id: 'KB4', title: "HyperX Alloy Elite 2", price: 129.99, rating: 4.4, reviews: 1900 },
      { id: 'KB5', title: "Keychron Q1 Pro", price: 199.99, rating: 4.6, reviews: 1500 },
    ],
  },
];

