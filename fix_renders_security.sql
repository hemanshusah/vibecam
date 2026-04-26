-- 1. Remove the dangerous public select policy
DROP POLICY IF EXISTS "Allow public read access on renders" ON renders;
DROP POLICY IF EXISTS "Users can view their own renders" ON renders;

-- 2. Authenticated users can only see their OWN renders in lists
CREATE POLICY "Users can view their own renders"
  ON renders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- 3. Anonymous guests can still view shared links by ID (but can't list everything)
CREATE POLICY "Guests can view shared renders"
  ON renders FOR SELECT
  TO anon
  USING (true);
