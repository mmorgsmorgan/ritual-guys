CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Player profiles linked to wallet address
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_games INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  highest_tier INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual game runs
CREATE TABLE runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  highest_tier INTEGER NOT NULL DEFAULT 0,
  max_chain INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  balls_dropped INTEGER DEFAULT 0,
  merges_performed INTEGER DEFAULT 0,
  discoveries JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evolution discoveries (community-wide feed)
CREATE TABLE discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 8),
  wallet_address TEXT NOT NULL,
  display_name TEXT,
  discovered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auth nonces for SIWE verification
CREATE TABLE auth_nonces (
  nonce TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 minutes'
);

-- Indexes
CREATE INDEX idx_runs_profile ON runs(profile_id);
CREATE INDEX idx_runs_score ON runs(score DESC);
CREATE INDEX idx_runs_created ON runs(created_at DESC);
CREATE INDEX idx_discoveries_tier ON discoveries(tier);
CREATE INDEX idx_discoveries_created ON discoveries(discovered_at DESC);
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_profiles_score ON profiles(highest_score DESC);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discoveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Runs viewable by all" ON runs FOR SELECT USING (true);
CREATE POLICY "Discoveries viewable by all" ON discoveries FOR SELECT USING (true);

-- Function to update profile stats after a run
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET
    total_games = total_games + 1,
    highest_score = GREATEST(highest_score, NEW.score),
    highest_tier = GREATEST(highest_tier, NEW.highest_tier),
    updated_at = NOW()
  WHERE id = NEW.profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_run_insert
  AFTER INSERT ON runs
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();

-- Cleanup expired nonces
CREATE OR REPLACE FUNCTION cleanup_expired_nonces()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_nonces WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
