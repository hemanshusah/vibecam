"use client";

// ============================================
// VibeCam V2 — Timeline Panel (Main Container)
// ============================================

import { useCallback, useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { TimeRuler } from './TimeRuler';
import { TrackLane } from './TrackLane';
import { VideoClip } from '@/lib/remotion-types';
import { ClipBlock } from './ClipBlock';
import { Playhead } from './Playhead';
import { ZoomIn, ZoomOut } from 'lucide-react';

// --- Multi-layer stacking helper ---
function calculateRows<T extends { startFrame: number; durationInFrames: number }>(items: T[]): T[][] {
  const rows: T[][] = [[]];
  const sorted = [...items].sort((a, b) => a.startFrame - b.startFrame);
  
  sorted.forEach(item => {
    let placed = false;
    for (let i = 0; i < rows.length; i++) {
       const row = rows[i];
       const overlaps = row.some(o => 
         (item.startFrame < o.startFrame + o.durationInFrames) && 
         (item.startFrame + item.durationInFrames > o.startFrame)
       );
       if (!overlaps) {
         row.push(item);
         placed = true;
         break;
       }
    }
    if (!placed) {
      rows.push([item]);
    }
  });
  return rows;
}

export function TimelinePanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const compositionProps = useEditorStore((s) => s.compositionProps);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const selectClip = useEditorStore((s) => s.selectClip);
  const selectOverlay = useEditorStore((s) => s.selectOverlay);
  const selectEffect = useEditorStore((s) => s.selectEffect);
  const selectedEffectId = useEditorStore((s) => s.selectedEffectId);
  const setPlayheadFrame = useEditorStore((s) => s.setPlayheadFrame);
  const deselectAll = useEditorStore((s) => s.deselectAll);

  const { clips, overlays, effects, fps } = compositionProps;
  const pxPerFrame = (zoom * 60) / fps;

  // Track stacking logic
  const videoRows = calculateRows(clips);
  const audioRows = calculateRows(compositionProps.audioTracks);
  const effectRows = calculateRows(effects);
  const overlayRows = calculateRows(overlays);

  // Calculate total width
  const maxFrames = [
    ...clips.map(c => c.startFrame + c.durationInFrames),
    ...overlays.map(o => o.startFrame + o.durationInFrames),
    ...effects.map(e => e.startFrame + e.durationInFrames),
    ...compositionProps.audioTracks.map(a => a.startFrame + a.durationInFrames)
  ];
  const maxFrame = maxFrames.length > 0 ? Math.max(...maxFrames) : 0;
  const timelineDurationFrames = Math.max(maxFrame + fps * 2, fps * 30);
  const totalWidth = timelineDurationFrames * pxPerFrame + 200;

  // Scrubbing logic
  const [isScrubbing, setIsScrubbing] = useState(false);

  const handleTimelineInteraction = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft - 120;
    const frame = Math.max(0, Math.round(x / pxPerFrame));
    setPlayheadFrame(frame);
  }, [pxPerFrame, setPlayheadFrame]);

  useEffect(() => {
    if (isScrubbing) {
      const onMouseMove = (e: MouseEvent) => handleTimelineInteraction(e);
      const onMouseUp = () => setIsScrubbing(false);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isScrubbing, handleTimelineInteraction]);

  // Click-to-seek on timeline
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleTimelineInteraction(e);
      deselectAll();
    }
  }, [handleTimelineInteraction, deselectAll]);

  // Zoom controls
  const zoomIn = () => setZoom(Math.min(10, zoom + 0.5));
  const zoomOut = () => setZoom(Math.max(0.5, zoom - 0.5));

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      setZoom(Math.max(0.5, Math.min(10, zoom + delta)));
    }
  }, [zoom, setZoom]);

  return (
    <div className="h-full flex flex-col">
      {/* Timeline header with zoom controls */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface/50">
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          Timeline
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-1 rounded hover:bg-bg text-muted hover:text-text transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono text-[10px] text-muted w-8 text-center">
            {zoom.toFixed(1)}x
          </span>
          <button
            onClick={zoomIn}
            className="p-1 rounded hover:bg-bg text-muted hover:text-text transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable timeline body */}
      <div
        ref={containerRef}
        className="flex-grow overflow-x-auto overflow-y-auto"
        onWheel={handleWheel}
      >
        <div style={{ width: totalWidth, minWidth: '100%' }}>
          {/* Time ruler */}
          <div className="pl-[120px]">
            <TimeRuler />
          </div>

          {/* Track lanes with playhead overlay */}
          <div className="relative" onClick={handleTimelineClick}>
            {/* Playhead spans all tracks */}
            <div className="absolute top-0 bottom-0 left-[120px]" style={{ width: totalWidth - 120 }}>
              <Playhead onMouseDown={(e) => {
                e.stopPropagation();
                setIsScrubbing(true);
              }} />
            </div>

            {/* Video track */}
            <TrackLane 
              label="Video" 
              type="video" 
              height={Math.max(64, videoRows.length * 40)}
            >
              {videoRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative h-10 w-full border-b border-border/10 last:border-0">
                  {row.map((clip) => (
                    <ClipBlock
                      key={clip.id}
                      clip={clip}
                      trackType="video"
                      isSelected={selectedClipId === clip.id}
                      onSelect={() => selectClip(clip.id)}
                      pxPerFrame={pxPerFrame}
                    />
                  ))}
                </div>
              ))}
            </TrackLane>

            {/* Audio track */}
            <TrackLane 
              label="Audio" 
              type="audio" 
              height={Math.max(48, audioRows.length * 40)}
            >
              {audioRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative h-10 w-full border-b border-border/10 last:border-0">
                  {row.map((track) => (
                    <ClipBlock
                      key={track.id}
                      clip={track as unknown as VideoClip}
                      trackType="audio"
                      isSelected={false}
                      onSelect={() => {}}
                      pxPerFrame={pxPerFrame}
                    />
                  ))}
                </div>
              ))}
            </TrackLane>

            {/* Overlays track (Support Multi-overlays via stacking) */}
            <TrackLane 
              label="Overlays" 
              type="overlay" 
              height={Math.max(40, overlayRows.length * 40)}
            >
              {overlayRows.map((row, rowIndex) => (
                <div 
                  key={rowIndex} 
                  className="relative h-10 w-full border-b border-border/10 last:border-0"
                >
                  {row.map((overlay) => (
                    <ClipBlock
                      key={overlay.id}
                      clip={overlay}
                      trackType="overlay"
                      isSelected={selectedOverlayId === overlay.id}
                      onSelect={() => selectOverlay(overlay.id)}
                      pxPerFrame={pxPerFrame}
                    />
                  ))}
                </div>
              ))}
            </TrackLane>

            {/* Effects track */}
            <TrackLane 
              label="Effects" 
              type="effect" 
              height={Math.max(40, effectRows.length * 40)}
            >
              {effectRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative h-10 w-full border-b border-border/10 last:border-0">
                  {row.map((effect) => (
                    <ClipBlock
                      key={effect.id}
                      clip={effect}
                      trackType="effect"
                      isSelected={selectedEffectId === effect.id}
                      onSelect={() => selectEffect(effect.id)}
                      pxPerFrame={pxPerFrame}
                    />
                  ))}
                </div>
              ))}
            </TrackLane>
          </div>
        </div>
      </div>
    </div>
  );
}
