// apps/web/types/index.ts
export type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  segment: string;
  price: string;
  engine: string;
  power: string;
  fuelEconomy: string;
  transmission: string;
};

export type ScoreBreakdown = {
  Performance: number;
  Comfort: number;
  Technology: number;
  Value: number;
  Reliability: number;
};

export type Review = {
  id: number;
  carId: number;
  title: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  author: string;
  date: string;
  comments: number;
  votes: number;
  excerpt: string;
  pros: string[];
  cons: string[];
  verdict: string;
};

export type Thread = {
  id: number;
  title: string;
  author: string;
  date: string;
  votes: number;
  comments: number;
  views: string;
  category: string;
};

export type BlogPost = {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
};
