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
  commentsCount?: number;
  votes: number;
  excerpt: string;
  pros: string[];
  cons: string[];
  verdict: string;
};

export type ReviewVehicle = {
  brand: string;
  model: string;
  year: number;
};

export type PublicReview = {
  id: string;
  slug?: string;
  title: string;
  score: number;
  author: string;
  date: string;
  commentsCount: number;
  excerpt?: string;
  vehicle?: ReviewVehicle;
};

export type Thread = {
  id: number | string;
  slug?: string;
  title: string;
  author: string;
  date: string;
  votes: number;
  comments: number;
  views?: string;
  category?: string;
  body?: string;
};

export type ForumPost = {
  id: string;
  topicId: string;
  authorId: string;
  parentPostId: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  date: string;
  replies: ForumPost[];
};

export type ForumTopicSummary = {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  createdAt: string;
  upvotes: number;
  votes: number;
  comments: number;
  body?: string;
};

export type ForumTopicDetail = ForumTopicSummary & {
  content: string;
  createdAt: string;
  updatedAt: string;
  posts: ForumPost[];
};

export type ForumComment = {
  id: number;
  author: string;
  date: string;
  body: string;
  contextType: "review" | "thread";
  contextTitle: string;
};

export type ReviewComment = {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: string;
  date: string;
};

export type BlogPost = {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
};
