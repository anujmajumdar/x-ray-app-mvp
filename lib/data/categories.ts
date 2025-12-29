// Category configurations data storage
import { TestCase } from './test-cases';

export interface CategoryConfig {
  id: string;
  name: string;
  keywordsRules: Array<{
    condition: (prospect: TestCase) => boolean;
    keywords: string[];
  }>;
  defaultKeywords: string[];
  mockCandidatesRules: Array<{
    condition: (prospect: TestCase) => boolean;
    candidates: any[];
  }>;
  defaultCandidates: any[];
}

export const categories: CategoryConfig[] = [
  {
    id: "water-bottles",
    name: "Water Bottles & Drinkware",
    keywordsRules: [
      {
        condition: (p) => p.title.toLowerCase().includes("stanley"),
        keywords: ["insulated travel tumbler", "stainless steel water bottle", "vacuum sealed drinkware"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("hydroflask"),
        keywords: ["wide mouth water bottle", "stainless steel flask", "insulated bottle"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("yeti"),
        keywords: ["insulated rambler bottle", "premium water bottle", "stainless steel flask"]
      }
    ],
    defaultKeywords: ["water bottle 32oz", "insulated drinkware", "stainless steel bottle"],
    mockCandidatesRules: [
      {
        condition: () => true, // Always use these for water bottles
        candidates: [
          { id: 'WB1', title: "HydroFlask 32oz Wide Mouth", price: 44.95, rating: 4.8, reviews: 15200 },
          { id: 'WB2', title: "Generic Plastic Bottle", price: 8.99, rating: 3.5, reviews: 12 },
          { id: 'WB3', title: "Yeti Rambler 30oz", price: 38.00, rating: 4.7, reviews: 9400 },
          { id: 'WB4', title: "CamelBak Chute Mag 32oz", price: 24.99, rating: 4.6, reviews: 3200 },
          { id: 'WB5', title: "Klean Kanteen Classic 32oz", price: 29.95, rating: 4.5, reviews: 2100 },
        ]
      }
    ],
    defaultCandidates: []
  },
  {
    id: "laptops",
    name: "Laptops & Computers",
    keywordsRules: [
      {
        condition: (p) => p.title.toLowerCase().includes("macbook"),
        keywords: ["premium laptop", "apple laptop", "professional notebook", "M3 processor"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("xps"),
        keywords: ["ultrabook", "dell laptop", "thin and light", "premium windows laptop"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("thinkpad"),
        keywords: ["business laptop", "lenovo notebook", "professional laptop", "enterprise laptop"]
      }
    ],
    defaultKeywords: ["2-in-1 laptop", "convertible laptop", "touchscreen notebook"],
    mockCandidatesRules: [
      {
        condition: () => true,
        candidates: [
          { id: 'LP1', title: "MacBook Air M2 13-inch 256GB", price: 1099.00, rating: 4.7, reviews: 8900 },
          { id: 'LP2', title: "Dell XPS 15 512GB", price: 1599.99, rating: 4.6, reviews: 4200 },
          { id: 'LP3', title: "ASUS ZenBook 14 OLED", price: 899.99, rating: 4.4, reviews: 1800 },
          { id: 'LP4', title: "Microsoft Surface Laptop 5", price: 999.99, rating: 4.5, reviews: 3100 },
          { id: 'LP5', title: "Acer Swift 3 14-inch", price: 649.99, rating: 4.2, reviews: 950 },
        ]
      }
    ],
    defaultCandidates: []
  },
  {
    id: "headphones",
    name: "Wireless Headphones",
    keywordsRules: [
      {
        condition: (p) => p.title.toLowerCase().includes("sony"),
        keywords: ["noise cancelling headphones", "wireless over-ear", "premium audio", "bluetooth headphones"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("bose"),
        keywords: ["quietcomfort headphones", "noise cancelling", "wireless audio", "comfort headphones"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("airpods"),
        keywords: ["apple headphones", "premium wireless", "spatial audio", "over-ear headphones"]
      }
    ],
    defaultKeywords: ["wireless headphones", "premium audio", "bluetooth over-ear", "high-end headphones"],
    mockCandidatesRules: [
      {
        condition: () => true,
        candidates: [
          { id: 'HP1', title: "Sony WH-1000XM4", price: 349.99, rating: 4.8, reviews: 12500 },
          { id: 'HP2', title: "Bose QuietComfort 35 II", price: 299.99, rating: 4.6, reviews: 9800 },
          { id: 'HP3', title: "JBL Live 660NC", price: 149.99, rating: 4.3, reviews: 3200 },
          { id: 'HP4', title: "Audio-Technica ATH-M50xBT2", price: 199.99, rating: 4.5, reviews: 2100 },
          { id: 'HP5', title: "Beats Studio3 Wireless", price: 249.99, rating: 4.4, reviews: 5600 },
        ]
      }
    ],
    defaultCandidates: []
  },
  {
    id: "smart-watches",
    name: "Smart Watches",
    keywordsRules: [
      {
        condition: (p) => p.title.toLowerCase().includes("apple"),
        keywords: ["smartwatch", "apple watch", "fitness tracker", "wearable device"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("samsung"),
        keywords: ["galaxy watch", "android smartwatch", "wearable", "fitness watch"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("garmin"),
        keywords: ["running watch", "gps watch", "fitness tracker", "sports watch"]
      }
    ],
    defaultKeywords: ["fitness tracker", "smartwatch", "activity tracker", "wearable"],
    mockCandidatesRules: [
      {
        condition: () => true,
        candidates: [
          { id: 'SW1', title: "Apple Watch Series 8 GPS 41mm", price: 399.99, rating: 4.7, reviews: 11200 },
          { id: 'SW2', title: "Samsung Galaxy Watch 5 Pro", price: 449.99, rating: 4.6, reviews: 6800 },
          { id: 'SW3', title: "Garmin Venu 2 Plus", price: 449.99, rating: 4.8, reviews: 4200 },
          { id: 'SW4', title: "Fitbit Charge 6", price: 159.99, rating: 4.4, reviews: 5400 },
          { id: 'SW5', title: "Amazfit GTR 4", price: 199.99, rating: 4.3, reviews: 1800 },
        ]
      }
    ],
    defaultCandidates: []
  },
  {
    id: "gaming-keyboards",
    name: "Gaming Keyboards",
    keywordsRules: [
      {
        condition: (p) => p.title.toLowerCase().includes("razer"),
        keywords: ["mechanical gaming keyboard", "rgb keyboard", "gaming peripheral", "mechanical switches"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("corsair"),
        keywords: ["mechanical keyboard", "rgb backlit", "gaming keyboard", "cherry mx switches"]
      },
      {
        condition: (p) => p.title.toLowerCase().includes("logitech"),
        keywords: ["wireless gaming keyboard", "mechanical keyboard", "low profile", "rgb keyboard"]
      }
    ],
    defaultKeywords: ["gaming keyboard", "mechanical keyboard", "rgb keyboard", "tenkeyless keyboard"],
    mockCandidatesRules: [
      {
        condition: () => true,
        candidates: [
          { id: 'KB1', title: "Razer Huntsman V3 Pro", price: 249.99, rating: 4.7, reviews: 3200 },
          { id: 'KB2', title: "Corsair K95 RGB Platinum", price: 199.99, rating: 4.6, reviews: 4800 },
          { id: 'KB3', title: "Logitech G Pro X TKL", price: 149.99, rating: 4.5, reviews: 2100 },
          { id: 'KB4', title: "HyperX Alloy Elite 2", price: 129.99, rating: 4.4, reviews: 1900 },
          { id: 'KB5', title: "Keychron Q1 Pro", price: 199.99, rating: 4.6, reviews: 1500 },
        ]
      }
    ],
    defaultCandidates: []
  }
];

