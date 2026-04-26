"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Player } from '@remotion/player';
import { VibeCamComposition } from '@/remotion/VibeCamComposition';
import { getTotalDurationFrames } from '@/lib/remotion-utils';
import { useParams } from 'next/navigation';
import { CompositionProps } from '@/lib/remotion-types';
import { Watermark } from '@/components/Watermark';

export const dynamic = 'force-dynamic';

interface RenderRecord {
  id: string;
  user_id: string;
  recording_id: string;
  status: string;
  progress: number;
  output_url?: string;
  composition: Record<string, unknown>;
  created_at: string;
}

export default function WatchExportPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [render, setRender] = useState<RenderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRender() {
      if (!id) return;
      
      const { data } = await supabase
        .from('renders')
        .select('*')
        .eq('id', id)
        .single();
      
      setRender(data);
      setLoading(false);
    }
    fetchRender();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={32} />
      </div>
    );
  }

  if (!render) return null;

  const composition = render.composition;
  const fps = ((composition as Record<string, unknown>)?.fps as number) || 30;
  const durationInFrames = 
    getTotalDurationFrames((composition as Record<string, unknown>)?.clips as { startFrame: number; durationInFrames: number }[] || []) + 
    (((composition as Record<string, unknown>)?.intro as { durationFrames: number })?.durationFrames || 0) + 
    (((composition as Record<string, unknown>)?.outro as { durationFrames: number })?.durationFrames || 0);

  if (render.status !== 'done') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          <Loader2 className="animate-spin" />
        </div>
        <h1 className="font-syne font-bold text-2xl">Video is still processing...</h1>
        <p className="font-mono text-sm text-muted max-w-sm">
          This export is being rendered on our servers. Please check back in a few moments.
        </p>
        <Link href="/" className="text-accent hover:underline font-mono text-xs flex items-center gap-2">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center p-6 animate-fade-in text-text overflow-x-hidden">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-12">
           <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-surface font-syne font-bold text-xs shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">V</div>
              <span className="font-syne font-bold text-lg tracking-tight">VibeCam</span>
           </Link>
           
           <Link 
             href="/auth/signup" 
             className="px-6 py-2 bg-surface/50 border border-border hover:border-accent hover:text-accent rounded-xl font-syne font-bold text-xs transition-all flex items-center gap-2"
           >
             Join VibeCam <ArrowLeft size={14} className="rotate-180" />
           </Link>
        </div>

        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/5 ring-1 ring-white/10 mb-10">
          <Player
            component={VibeCamComposition}
            inputProps={composition as unknown as CompositionProps}
            durationInFrames={Math.max(1, durationInFrames)}
            fps={fps}
            compositionWidth={((composition as unknown as CompositionProps)?.width as number) || 1920}
            compositionHeight={((composition as unknown as CompositionProps)?.height as number) || 1080}
            style={{ width: '100%', height: '100%' }}
            controls
          />
          <Watermark />
        </div>

        {/* Info Card */}
        <div className="w-full bg-surface/30 backdrop-blur-md border border-border p-10 rounded-[40px] mb-20">
           <div className="space-y-3">
              <h1 className="font-syne font-bold text-4xl tracking-tight text-white">
                 {(render.composition as Record<string, unknown>)['title'] as string || 'Untitled Recording'}
              </h1>
              <p className="font-mono text-sm text-muted uppercase tracking-[0.2em]">
                 Created with VibeCam V2 · High Quality Export
              </p>
           </div>
        </div>

        {/* Glowing CTA Section */}
        <div className="flex flex-col items-center gap-8 py-10">
           <p className="font-mono text-xs text-muted tracking-widest uppercase">Want to record and edit videos like this?</p>
           <Link 
             href="/auth/signup" 
             className="relative group"
           >
              {/* Button Glow */}
              <div className="absolute -inset-1 bg-accent rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative px-12 py-5 bg-accent text-surface font-syne font-bold rounded-2xl hover:bg-white transition-all text-lg shadow-2xl shadow-accent/20">
                 Start Recording for Free
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
