import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type RecordingMetadata = {
  id?: string;
  title?: string;
  date: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
  mimeType: string;
  hasMic: boolean;
  hasCamera: boolean;
};

export type RecordingStorageItem = RecordingMetadata & {
  blob: Blob;
  videoUrl?: string;
  userId?: string;
  tag?: string;
};

export function useStorage() {
  const saveRecording = useCallback(async (item: RecordingStorageItem) => {
    try {
      // 1. Upload Video Blob
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, item.blob, {
          contentType: item.mimeType,
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(uploadData.path);
        
      const videoUrl = publicUrlData.publicUrl;

      // 3. Save into videos table (with user_id if authenticated)
      const insertPayload: Record<string, unknown> = {
        video_url: videoUrl,
        title: item.title || 'Untitled Recording',
        duration: Math.round(item.duration),
        trim_start: item.trimStart,
        trim_end: item.trimEnd,
        mime_type: (item as any).tag || item.mimeType,
        has_mic: item.hasMic,
        has_camera: item.hasCamera,
      };

      if (item.userId) {
        insertPayload.user_id = item.userId;
      }

      const { data: dbData, error: dbError } = await supabase
        .from('videos')
        .insert([insertPayload])
        .select()
        .single();

      if (dbError) throw dbError;

      return dbData.id;
    } catch (e) {
      console.error('Failed to save to Supabase', e);
      throw e;
    }
  }, []);

  const loadRecording = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) throw error || new Error('Not found');

      return {
        id: data.id,
        date: data.created_at,
        duration: data.duration,
        trimStart: data.trim_start,
        trimEnd: data.trim_end,
        mimeType: data.mime_type,
        hasMic: data.has_mic,
        hasCamera: data.has_camera,
        videoUrl: data.video_url
      };
    } catch (e) {
      console.error('Failed to load from Supabase', e);
      return undefined;
    }
  }, []);

  return { saveRecording, loadRecording };
}

