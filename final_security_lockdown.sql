-- ============================================================
-- VibeCam V2 — Final Security & Type-Safety Lockdown
-- ============================================================

-- 1. CLEANUP: Clear out all previous conflicting policies
DROP POLICY IF EXISTS "Users can view their own renders" ON renders;
DROP POLICY IF EXISTS "Users can insert their own renders" ON renders;
DROP POLICY IF EXISTS "Users can update their own renders" ON renders;
DROP POLICY IF EXISTS "Allow public read access on renders" ON renders;
DROP POLICY IF EXISTS "Guests can view shared renders" ON renders;
DROP POLICY IF EXISTS "Users can see their own renders" ON renders;
DROP POLICY IF EXISTS "Users can see their own videos" ON videos;
DROP POLICY IF EXISTS "Guests can see shared videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

-- 2. VIDEOS Table (Column is UUID)
-- Authenticated users see their own (UUID = UUID comparison)
CREATE POLICY "Users can see their own videos" ON videos 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id); 

-- Anyone with a link can view (Guest Access)
CREATE POLICY "Guests can see shared videos" ON videos 
  FOR SELECT TO anon 
  USING (true);

-- Users can only delete/update their own (UUID = UUID)
CREATE POLICY "Users can manage their own videos" ON videos
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- 3. RENDERS Table (Column is TEXT)
-- Authenticated users see their own (UUID-cast-to-text = TEXT comparison)
CREATE POLICY "Users can see their own renders" ON renders 
  FOR SELECT TO authenticated 
  USING (auth.uid()::text = user_id);

-- Anyone with a link can view (Guest Access)
CREATE POLICY "Guests can see shared renders" ON renders 
  FOR SELECT TO anon 
  USING (true);

-- Ensure authenticated users can only insert their own renders
CREATE POLICY "Users can insert their own renders" ON renders 
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Ensure users can only update/delete their own renders
CREATE POLICY "Users can manage their own renders" ON renders
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id);


-- 4. STORAGE Security
DROP POLICY IF EXISTS "Authenticated users can upload recordings" ON storage.objects;
CREATE POLICY "Authenticated users can upload recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recordings');
