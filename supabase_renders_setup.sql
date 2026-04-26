-- ============================================
-- VibeCam V2 — Renders Table Setup
-- ============================================

CREATE TABLE IF NOT EXISTS renders (
  id            TEXT PRIMARY KEY,
  recording_id  TEXT NOT NULL,
  user_id       TEXT,
  status        TEXT NOT NULL DEFAULT 'queued',
  progress      INTEGER DEFAULT 0,
  output_url    TEXT,
  error         TEXT,
  resolution    TEXT NOT NULL,
  format        TEXT NOT NULL,
  duration_sec  REAL,
  file_size     INTEGER,
  composition   JSONB NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);

-- RLS policies
ALTER TABLE renders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own renders"
  ON renders FOR SELECT
  USING (user_id = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "Users can insert their own renders"
  ON renders FOR INSERT
  WITH CHECK (user_id = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "Users can update their own renders"
  ON renders FOR UPDATE
  USING (user_id = auth.uid()::text OR user_id IS NULL);
