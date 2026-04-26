"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, ArrowLeft, Scissors } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Watermark } from '@/components/Watermark';
import { useAuth } from '@/context/AuthProvider';
import { formatTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface VideoRecord {
  id: string;
  title: string;
  video_url: string;
  duration: number;
  user_id: string;
  mime_type: string;
}

export default function WatchRecordingPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const { user } = useAuth();
  const [recording, setRecording] = useState<VideoRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecording() {
      if (!id) return;
      
      const { data } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      
      setRecording(data);
      setLoading(false);
    }
    fetchRecording();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" size={32} />
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="font-syne font-bold text-2xl text-red">Video not found</h1>
        <Link href="/" className="text-accent hover:underline">Back to VibeCam</Link>
      </div>
    );
  }

  const isOwner = user && user.id === recording.user_id;

  const toggleFullscreen = () => {
    const container = document.getElementById('player-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 animate-fade-in text-text">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-surface font-syne font-bold text-xs shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">V</div>
              <span className="font-syne font-bold text-lg tracking-tight">VibeCam</span>
           </Link>
           {user && (
             <Link href="/dashboard" className="px-4 py-2 bg-surface border border-border hover:border-accent hover:text-accent rounded-xl font-syne font-bold text-xs transition-all flex items-center gap-2">
                My Library <ArrowLeft size={14} className="rotate-180" />
             </Link>
           )}
        </div>

        {/* Video Player */}
        <div 
          id="player-container"
          className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 group"
        >
           <video 
             src={recording.video_url} 
             controls 
             className="w-full h-full object-contain" 
             autoPlay
             onDoubleClick={toggleFullscreen}
           />
           <Watermark />
        </div>

        {/* Info & Admin Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface border border-border p-8 rounded-3xl">
           <div className="text-center md:text-left space-y-1">
              <h1 className="font-syne font-bold text-3xl">
                 {recording.title || 'Quick Recording'}
              </h1>
              <p className="font-mono text-sm text-muted">
                 High-resolution {recording.mime_type === 'video' ? 'Selfie' : 'Screen'} Share · {formatTime(recording.duration)}
              </p>
           </div>

           {isOwner && (
              <div className="flex items-center gap-3 animate-fade-in">
                 <Link 
                   href={`/edit/${recording.id}`}
                   className="flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 text-accent font-syne font-bold rounded-xl hover:bg-accent hover:text-surface transition-all"
                 >
                   <Scissors size={18} /> Advanced Edit
                 </Link>
                 <a 
                   href={recording.video_url} 
                   download 
                   className="flex items-center gap-2 px-6 py-3 bg-surface border border-border font-syne font-bold rounded-xl hover:border-accent transition-all"
                 >
                   <Download size={18} /> Download
                 </a>
              </div>
           )}
        </div>

        {/* CTA for viewers */}
        {!isOwner && (
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
             <span>Captured by</span>
             <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
             <span className="font-bold text-text uppercase tracking-widest">VibeCam V2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
