export interface RedditPost {
  title: string;
  comments: string[];
  permalink: string;
  threadUrl: string;
}

export interface SourceThread {
  title: string;
  thread_url: string;
}

export interface StructuredRedditData {
  subreddit: string;
  scrapedAt: string;
  posts: RedditPost[];
}

export interface SaasIdea {
  idea_name: string;
  problem: string;
  demand_level: "Low" | "Medium" | "High";
  existing_solutions: string[];
  similar_competitors: string[];
  user_complaints: string[];
  opportunity: string;
  monetization_model: string;
  pricing_hint: string;
  revenue_potential: string;
  go_to_market: string;
  score: number;
  verdict: "Weak" | "Decent" | "Strong";
  source_threads: SourceThread[];
}

export interface RunCost {
  decodo: {
    requests: number;
    usd: number;
  };
  claude: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    usd: number | null;
  } | null;
  totalUsd: number;
}

export interface SavedRun {
  id: string;
  subreddit: string;
  createdAt: string;
  durationMs: number;
  status: "success" | "error";
  error?: string;
  source: StructuredRedditData | null;
  ideas: SaasIdea[];
  cost: RunCost;
}

export interface RunSummary {
  id: string;
  subreddit: string;
  createdAt: string;
  status: SavedRun["status"];
  ideaCount: number;
  totalUsd: number;
}