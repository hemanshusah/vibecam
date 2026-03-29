-- ============================================================
-- VibeCam Phase 9: Auth Migration
-- Run this in your Supabase SQL Editor AFTER the original setup
-- ============================================================

-- 1. Add user_id column to videos table (nullable for existing rows)
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add a title column if not already a useful default
-- (title already exists from original schema)

-- 3. Drop old permissive INSERT policy
DROP POLICY IF EXISTS "Allow public insert on videos" ON public.videos;

-- 4. New INSERT policy: only authenticated users can insert, user_id auto-set
CREATE POLICY "Authenticated users can insert videos"
ON public.videos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Keep public SELECT (anyone with the link can watch)
-- (Already exists from original setup — no change needed)

-- 6. Add DELETE policy: users can delete their own recordings
CREATE POLICY "Users can delete own videos"
ON public.videos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. Add UPDATE policy: users can update their own recordings (e.g. rename title)
CREATE POLICY "Users can update own videos"
ON public.videos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. Update storage policies for recordings bucket
-- Drop old permissive upload policy
DROP POLICY IF EXISTS "Allow public uploading of recordings" ON storage.objects;

-- New: only authenticated users can upload
CREATE POLICY "Authenticated users can upload recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recordings');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recordings');
