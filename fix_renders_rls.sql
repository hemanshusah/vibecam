-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view their own renders" ON renders;

-- New policy: Anyone can view a render if they have the ID (PUBLIC READ)
CREATE POLICY "Allow public read access on renders"
  ON renders FOR SELECT
  USING (true);
