"use client";

// ============================================
// VibeCam V2 — Editor Route /edit/[id]
// ============================================

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEditorStore } from '@/store/useEditorStore';
import { createEmptyComposition } from '@/lib/remotion-types';
import { useEditorKeyboard } from '@/hooks/useEditorKeyboard';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { Toolbar } from '@/components/editor/Toolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { SidebarPanel } from '@/components/editor/SidebarPanel';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { TimelinePanel } from '@/components/editor/timeline/TimelinePanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { Loader2, MonitorX } from 'lucide-react';
import Link from 'next/link';

type RecordingData = {
  id: string;
  title: string;
  video_url: string;
  duration: number;
  trim_start: number;
  trim_end: number;
  mime_type: string;
  has_mic: boolean;
  has_camera: boolean;
  created_at: string;
};

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const initComposition = useEditorStore((s) => s.initComposition);
  const isSidebarOpen = useEditorStore((s) => s.isSidebarOpen);

  // Keyboard shortcuts
  useEditorKeyboard();

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load recording data
  useEffect(() => {
    if (!id) return;

    async function loadRecording() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: dbError } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError || !data) {
          setError('Recording not found. It may have been deleted or the link is invalid.');
          setLoading(false);
          return;
        }

        const recording = data as RecordingData;

        const composition = createEmptyComposition(
          recording.video_url,
          recording.duration,
          30,
        );

        initComposition(composition, recording.id, recording.title || 'Untitled Recording');
        setLoading(false);
      } catch (err) {
        console.error('Failed to load recording:', err);
        setError('Something went wrong loading this recording.');
        setLoading(false);
      }
    }

    loadRecording();
  }, [id, initComposition]);

  // Mobile fallback
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center bg-bg">
        <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <MonitorX size={36} className="text-muted" />
        </div>
        <h2 className="font-syne font-bold text-2xl text-text">Desktop Required</h2>
        <p className="font-mono text-sm text-muted max-w-sm">
          The VibeCam editor requires a desktop browser with a screen width of at least 1024px.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg space-y-4">
        <Loader2 size={32} className="text-accent animate-spin" />
        <p className="font-mono text-sm text-muted">Loading editor…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center bg-bg">
        <h2 className="font-syne font-bold text-3xl text-red">Unable to load recording</h2>
        <p className="font-mono text-sm text-muted max-w-sm">{error}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <EditorLayout
        toolbar={<Toolbar onExport={() => setExportOpen(true)} />}
        sidebar={<EditorSidebar />}
        sidebarPanel={<SidebarPanel />}
        preview={<PreviewPanel />}
        properties={<PropertiesPanel />}
        timeline={<TimelinePanel />}
        isSidebarOpen={isSidebarOpen}
      />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  );
}
