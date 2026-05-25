export interface Profile {
  id: string;
  wallet_address: string;
  display_name: string | null;
  avatar_url: string | null;
  total_games: number;
  highest_score: number;
  highest_tier: number;
  created_at: string;
  updated_at: string;
}

export interface Run {
  id: string;
  profile_id: string;
  score: number;
  highest_tier: number;
  max_chain: number;
  duration_seconds: number | null;
  balls_dropped: number;
  merges_performed: number;
  discoveries: number[];
  created_at: string;
}

export interface Discovery {
  id: string;
  profile_id: string;
  run_id: string;
  tier: number;
  wallet_address: string;
  display_name: string | null;
  discovered_at: string;
}
