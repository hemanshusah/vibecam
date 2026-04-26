"use client";

// ============================================
// VibeCam V2 — Export Modal
// ============================================

import { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { X, Download, Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ExportStatus = 'idle' | 'rendering' | 'done' | 'error';

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const compositionProps = useEditorStore((s) => s.compositionProps);
  const recordingTitle = useEditorStore((s) => s.recordingTitle);

  const [resolution, setResolution] = useState('1920x1080');
  const [format, setFormat] = useState<'mp4' | 'gif'>('mp4');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [outputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalFrames = compositionProps.clips.reduce(
    (max, c) => Math.max(max, c.startFrame + c.durationInFrames),
    0,
  ) + (compositionProps.intro?.durationFrames ?? 0) + (compositionProps.outro?.durationFrames ?? 0);

  const estimatedDuration = totalFrames / compositionProps.fps;

  const handleExport = async () => {
    if (compositionProps.clips.length === 0) {
      setError('No clips to export. Add at least one video clip to the timeline.');
      return;
    }

    setStatus('rendering');
    setProgress(0);
    setError(null);

    try {
      // Get current user for RLS
      const { data: { user } } = await supabase.auth.getUser();

      // Trigger render via API
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition: compositionProps,
          resolution,
          format,
          quality,
          title: recordingTitle,
          user_id: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to start render');
      }

      const { renderId } = await res.json();
      console.log('--- Export Started ---', { renderId });

      setStatus('done');
      
      // Redirect to dashboard immediately so they can see it in 'renders' tab
      setTimeout(() => {
        window.location.href = '/dashboard?tab=renders';
      }, 500);
    } catch (err) {
      console.error('Export Error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to start render');
    }
  };

  const copyLink = () => {
    if (outputUrl) {
      navigator.clipboard.writeText(outputUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne font-bold text-lg text-text">Export Video</h3>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>

        {status === 'idle' && (
          <>
            {/* Settings */}
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="prop-select"
                >
                  <option value="1920x1080">1920×1080 (1080p)</option>
                  <option value="1280x720">1280×720 (720p)</option>
                  <option value="854x480">854×480 (480p)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'mp4' | 'gif')}
                  className="prop-select"
                >
                  <option value="mp4">MP4</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as 'high' | 'medium' | 'low')}
                  className="prop-select"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Info */}
              <div className="p-3 rounded-xl bg-bg border border-border">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted">Duration</span>
                  <span className="text-text">{estimatedDuration.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between font-mono text-xs mt-1">
                  <span className="text-muted">Total frames</span>
                  <span className="text-text">{totalFrames}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red/10 border border-red/20 mb-4">
                <AlertCircle size={16} className="text-red shrink-0" />
                <p className="font-mono text-xs text-red">{error}</p>
              </div>
            )}

            <button
              onClick={handleExport}
              className="w-full py-3 bg-accent text-surface font-syne font-bold text-sm rounded-xl hover:bg-white transition-colors"
            >
              Export & Track Progress
            </button>
          </>
        )}

        {status === 'rendering' && (
          <div className="text-center space-y-4">
            <Loader2 size={32} className="text-accent animate-spin mx-auto" />
            <p className="font-syne font-bold text-text">Rendering...</p>
            <div className="w-full bg-bg rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-xs text-muted">
              Frame {Math.round((progress / 100) * totalFrames)} of {totalFrames}
            </p>
            {progress > 0 && progress < 100 && (
              <p className="font-mono text-[10px] text-accent uppercase tracking-widest animate-pulse transition-opacity">
                Est. time remaining: {Math.ceil(((100 - progress) / (progress / 1)) * 2)}s
              </p>
            )}
          </div>
        )}

        {status === 'done' && (
          <div className="text-center space-y-4">
            <CheckCircle size={40} className="text-accent mx-auto" />
            <p className="font-syne font-bold text-lg text-text">Export Complete!</p>

            <div className="flex flex-col gap-2">
              {outputUrl && (
                <>
                  <a
                    href={outputUrl}
                    download={`${recordingTitle}.${format}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-surface font-syne font-bold text-sm rounded-xl hover:bg-white transition-colors"
                  >
                    <Download size={16} />
                    Download {format.toUpperCase()}
                  </a>
                  <button
                    onClick={copyLink}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-bg border border-border text-text font-mono text-xs rounded-xl hover:border-accent transition-colors"
                  >
                    <Link2 size={14} />
                    Copy shareable link
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <AlertCircle size={40} className="text-red mx-auto" />
            <p className="font-syne font-bold text-text">Export Failed</p>
            <p className="font-mono text-xs text-muted">{error}</p>
            <button
              onClick={() => { setStatus('idle'); setError(null); }}
              className="w-full py-3 bg-accent text-surface font-syne font-bold text-sm rounded-xl hover:bg-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
