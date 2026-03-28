-- 1. Create the 'videos' Metadata Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Untitled Recording',
    video_url TEXT NOT NULL,
    duration BIGINT DEFAULT 0,
    trim_start FLOAT DEFAULT 0,
    trim_end FLOAT DEFAULT 1,
    mime_type TEXT DEFAULT 'video/webm',
    has_mic BOOLEAN DEFAULT false,
    has_camera BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS) for the table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can view any video (Public SELECT)
CREATE POLICY "Allow public read access on videos"
ON public.videos FOR SELECT
USING (true);

-- 4. Policy: Anyone can upload a new video (Public INSERT)
CREATE POLICY "Allow public insert on videos"
ON public.videos FOR INSERT
WITH CHECK (true);

-- Note: We intentionally do NOT create UPDATE or DELETE policies. 
-- This prevents random users from deleting or altering other people's videos!

-- 5. Create the 'recordings' Storage Bucket (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recordings', 'recordings', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policy: Anyone can view bucket objects
CREATE POLICY "Allow public viewing of recordings"
ON storage.objects FOR SELECT
USING (bucket_id = 'recordings');

-- 7. Storage Policy: Anyone can upload generic files to bucket
CREATE POLICY "Allow public uploading of recordings"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recordings');

-- Note: Same security pattern. No UPDATE or DELETE allowed.
