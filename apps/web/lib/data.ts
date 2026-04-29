// apps/web/lib/data.ts
import type { Car, Review, Thread, BlogPost } from '@/types';

export const cars: Car[] = [
  { id: 1, brand: 'Toyota',     model: 'Corolla Cross', year: 2024, segment: 'SUV',       price: '$31,500', engine: '2.0L Hybrid',    power: '196 hp', fuelEconomy: '42 mpg',   transmission: 'CVT'         },
  { id: 2, brand: 'Honda',      model: 'Civic',         year: 2024, segment: 'Sedan',     price: '$27,200', engine: '1.5L Turbo',      power: '158 hp', fuelEconomy: '36 mpg',   transmission: 'CVT'         },
  { id: 3, brand: 'Ford',       model: 'Ranger',        year: 2025, segment: 'Pickup',    price: '$34,900', engine: '2.3L EcoBoost',   power: '270 hp', fuelEconomy: '24 mpg',   transmission: '10-Spd Auto' },
  { id: 4, brand: 'Tesla',      model: 'Model 3',       year: 2024, segment: 'EV',        price: '$42,000', engine: 'Electric',        power: '358 hp', fuelEconomy: '134 MPGe', transmission: '1-Speed'     },
  { id: 5, brand: 'Volkswagen', model: 'Polo',          year: 2024, segment: 'Hatchback', price: '$24,500', engine: '1.0L TSI',        power: '116 hp', fuelEconomy: '38 mpg',   transmission: '6-Spd Auto'  },
  { id: 6, brand: 'BMW',        model: '3 Series',      year: 2024, segment: 'Sedan',     price: '$44,900', engine: '2.0L TwinTurbo',  power: '255 hp', fuelEconomy: '32 mpg',   transmission: '8-Spd Auto'  },
  { id: 7, brand: 'Jeep',       model: 'Compass',       year: 2025, segment: 'SUV',       price: '$33,200', engine: '2.0L Turbo',      power: '200 hp', fuelEconomy: '29 mpg',   transmission: '9-Spd Auto'  },
  { id: 8, brand: 'Chevrolet',  model: 'Onix',          year: 2024, segment: 'Hatchback', price: '$22,000', engine: '1.0L Turbo',      power: '116 hp', fuelEconomy: '37 mpg',   transmission: '6-Spd Auto'  },
];

export const reviews: Review[] = [
  {
    id: 1, carId: 4,
    title: 'Tesla Model 3 2024: Still the EV benchmark',
    score: 9.2,
    scoreBreakdown: { Performance: 9.5, Comfort: 8.8, Technology: 9.8, Value: 8.5, Reliability: 9.0 },
    author: 'alexreview', date: '1 day ago', comments: 23, votes: 156,
    excerpt: "After years at the top, Tesla's Model 3 continues to set the standard for electric vehicles. The 2024 refresh brings a bolder interior and extended range that puts even more distance between it and the competition.",
    pros: ['Outstanding range & Supercharger network', 'Industry-leading technology & software', 'Over-the-air updates keep it fresh', 'Blistering performance in all trims'],
    cons: ['Build quality still inconsistent at delivery', 'No physical controls for anything', 'Higher insurance costs than rivals'],
    verdict: "The Model 3 remains the gold standard for EVs. Despite growing competition from Hyundai, VW, and BMW, Tesla's ecosystem and software advantages keep it firmly at the top of its class.",
  },
  {
    id: 2, carId: 2,
    title: 'Honda Civic 2024: A masterclass in everyday driving',
    score: 9.0,
    scoreBreakdown: { Performance: 8.5, Comfort: 9.0, Technology: 8.8, Value: 9.5, Reliability: 9.2 },
    author: 'marinacar', date: '3 days ago', comments: 18, votes: 112,
    excerpt: "The Civic has always been the benchmark compact sedan. The 2024 model refines what was already great without fixing what wasn't broken — it's still the smart choice for the discerning daily driver.",
    pros: ['Engaging and precise to drive', 'Spacious, well-appointed interior', 'Exceptional long-term reliability', 'Competitive pricing with strong value'],
    cons: ['Infotainment interface has a learning curve', 'Slightly limited rear headroom'],
    verdict: "Honda's Civic continues to be one of the best compact cars money can buy. An excellent all-rounder for the daily commuter and weekend driver alike.",
  },
  {
    id: 3, carId: 6,
    title: 'BMW 3 Series 2024: The definitive sports sedan',
    score: 9.1,
    scoreBreakdown: { Performance: 9.5, Comfort: 8.8, Technology: 9.0, Value: 7.5, Reliability: 8.5 },
    author: 'carlosm', date: '5 days ago', comments: 31, votes: 98,
    excerpt: "The 3 Series remains the definitive premium sports sedan. Sharp handling, a refined cabin, and BMW's characteristic driving character make it almost impossible to top in its segment.",
    pros: ["Driver-focused dynamics unmatched in class", 'Premium, well-crafted interior', 'Powerful & immediately responsive engines', 'Comprehensive tech and safety suite'],
    cons: ['Premium options pricing adds up fast', 'Small trunk for the segment', 'Complex iDrive for some users'],
    verdict: "Still the driver's choice in the premium compact segment. Worth every penny if you genuinely love to drive and appreciate engineering excellence.",
  },
  {
    id: 4, carId: 1,
    title: 'Toyota Corolla Cross Hybrid: Sensible never felt this good',
    score: 8.5,
    scoreBreakdown: { Performance: 7.5, Comfort: 8.8, Technology: 8.5, Value: 9.2, Reliability: 9.5 },
    author: 'pedroh', date: '1 week ago', comments: 12, votes: 74,
    excerpt: "Toyota took the best-selling Corolla formula and added hybrid efficiency to a raised SUV body. The result is a remarkably sensible, capable, and fuel-efficient family hauler that's hard to argue with.",
    pros: ['Exceptional hybrid fuel economy', 'Toyota legendary reliability', 'Comfortable, refined ride quality', 'Toyota Safety Sense standard across range'],
    cons: ['Not exciting to drive enthusiasts', 'CVT can feel uninspired at highway pace'],
    verdict: "If practicality, reliability and value are your priorities, the Corolla Cross Hybrid is almost impossible to argue against. The sensible choice that doesn't feel like a compromise.",
  },
  {
    id: 5, carId: 3,
    title: 'Ford Ranger 2025: The pickup that does it all',
    score: 8.2,
    scoreBreakdown: { Performance: 8.5, Comfort: 7.8, Technology: 8.2, Value: 8.0, Reliability: 8.5 },
    author: 'frederico', date: '1 week ago', comments: 9, votes: 61,
    excerpt: "Ford's mid-size pickup gets meaningful updates for 2025. Whether you're hauling cargo, tackling trails, or simply commuting, the Ranger handles each scenario with surprising polish and capability.",
    pros: ['Capable off-road performance', 'Powerful and refined EcoBoost engine', 'Generous payload and towing capacity', 'Well-equipped cabin with good technology'],
    cons: ['Firm ride quality on paved roads', 'Below-average fuel economy for the segment'],
    verdict: "The best all-around mid-size pickup for buyers who need real truck capability without full-size running costs. The Ranger finally delivers on its potential.",
  },
  {
    id: 6, carId: 7,
    title: "Jeep Compass 2025: Finally living up to its name",
    score: 8.4,
    scoreBreakdown: { Performance: 8.0, Comfort: 8.5, Technology: 7.8, Value: 8.2, Reliability: 8.0 },
    author: 'sarahv', date: '2 weeks ago', comments: 15, votes: 55,
    excerpt: 'After years of playing catch-up with rivals, the 2025 Compass arrives with a genuinely premium interior, improved off-road credentials, and the Jeep heritage buyers actually want.',
    pros: ['Significantly upgraded interior quality', 'Iconic Jeep styling and off-road heritage', 'Strong off-road packages available', 'Improved ride comfort'],
    cons: ['Infotainment still lags some competitors', 'Fuel economy disappoints vs class leaders'],
    verdict: "A much-improved Compass that's finally competitive in the compact SUV segment. Jeep has addressed the main criticisms and delivered something worth considering.",
  },
];

export const threads: Thread[] = [
  { id: 1, title: "What's the best first car under $25,000 in 2026?",                author: 'Lucas_F',            date: '2 hours ago',  votes: 89,  comments: 47, views: '18.3k', category: 'Buying Advice' },
  { id: 2, title: 'Toyota vs Honda reliability — who really wins long-term?',          author: 'marianag',           date: '4 hours ago',  votes: 74,  comments: 63, views: '21.1k', category: 'Discussion'    },
  { id: 3, title: 'EV vs Hybrid in 2026 — which actually makes more financial sense?', author: 'techdriver',         date: '6 hours ago',  votes: 61,  comments: 38, views: '9.7k',  category: 'Discussion'    },
  { id: 4, title: 'Best tips for negotiating at a dealership (without losing your mind)', author: 'rafaelb',          date: '12 hours ago', votes: 55,  comments: 29, views: '14.2k', category: 'Buying Advice' },
  { id: 5, title: 'Is the BMW 3 Series really worth it when the Honda Civic exists?',   author: 'philosopherdriver', date: '1 day ago',    votes: 48,  comments: 71, views: '8.9k',  category: 'Discussion'    },
];

export const blogPosts: BlogPost[] = [
  { id: 1, title: '10 EVs to Watch in the Second Half of 2026',      category: 'News',     date: 'Today',      readTime: '5 min read'  },
  { id: 2, title: 'How to Read a Car Review Without Being Fooled',   category: 'Guide',    date: 'Yesterday',  readTime: '7 min read'  },
  { id: 3, title: 'The Rise of Hybrid SUVs: Why Everyone Wants One', category: 'Analysis', date: '3 days ago', readTime: '9 min read'  },
  { id: 4, title: 'Used Car Buying Guide 2026: Avoid These Mistakes', category: 'Guide',   date: '1 week ago', readTime: '12 min read' },
];

export function getCarById(id: number): Car | undefined {
  return cars.find(c => c.id === id);
}

export function getReviewById(id: number): Review | undefined {
  return reviews.find(r => r.id === id);
}
