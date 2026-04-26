"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Player } from '@remotion/player';
import { VibeCamComposition } from '@/remotion/VibeCamComposition';
import { getTotalDurationFrames } from '@/lib/remotion-utils';
import { CompositionProps } from '@/lib/remotion-types';
import { Watermark } from '@/components/Watermark';

import { useAuth } from '@/context/AuthProvider';

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

export default function WatchExportPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [render, setRender] = useState<RenderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRender() {
      const { data } = await supabase
        .from('renders')
        .select('*')
        .eq('id', params.id)
        .single();
      
      setRender(data);
      setLoading(false);
    }
    fetchRender();
  }, [params.id]);

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
  const durationInFrames = getTotalDurationFrames((composition as Record<string, unknown>)?.clips as { startFrame: number; durationInFrames: number }[] || []) + 
                           ((composition as Record<string, unknown>)?.intro as { durationFrames: number })?.durationFrames || 0 + 
                           ((composition as Record<string, unknown>)?.outro as { durationFrames: number })?.durationFrames || 0;

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
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-surface font-syne font-bold text-xs shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">V</div>
             <span className="font-syne font-bold text-lg tracking-tight">VibeCam</span>
          </Link>
          
          <Link 
            href={user ? "/dashboard" : "/auth/signup"} 
            className="px-4 py-2 bg-surface border border-border hover:border-accent hover:text-accent rounded-xl font-syne font-bold text-xs transition-all flex items-center gap-2"
          >
            {user ? "Dashboard" : "Join VibeCam"} <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
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

        {/* Info & Admin Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface border border-border p-8 rounded-3xl">
          <div className="text-center md:text-left space-y-1">
             <h1 className="font-syne font-bold text-3xl text-text">
                {(render.composition as Record<string, unknown>)['title'] as string || 'Shared Recording'}
             </h1>
             <p className="font-mono text-sm text-muted">
                Created with VibeCam V2 · High Quality Export
             </p>
          </div>

          {/* Admin Tools (Owner Only) */}
          {user && user.id === render.user_id && (
            <div className="flex items-center gap-3 animate-fade-in">
               <a 
                href={render.output_url} 
                download
                className="flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-all shadow-lg shadow-accent/20"
              >
                <Download size={18} /> Download MP4
              </a>
            </div>
          )}
        </div>

        {/* CTA for anonymous (Non-Owners) */}
        {(!user || user.id !== render.user_id) && (
          <div className="flex flex-col items-center gap-6 pt-12 border-t border-border/40">
             <p className="font-mono text-sm text-muted">Want to record and edit videos like this?</p>
             <Link href="/auth/signup" className="px-10 py-4 bg-accent text-surface font-syne font-bold rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/40 text-lg">
                Start Recording for Free
             </Link>
          </div>
        )}

        {/* Branding Footer */}
        <div className="flex justify-center pt-8 pb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border rounded-full font-mono text-[10px] text-muted">
             <span>Rendered by</span>
             <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
             <span className="font-bold text-text uppercase tracking-widest">VibeCam V2 Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
