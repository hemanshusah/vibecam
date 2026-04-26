"use client";

// ============================================
// VibeCam V2 — ClipBlock (Draggable Clip)
// ============================================

import React, { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import type { VideoClip, Overlay, Effect } from '@/lib/remotion-types';
import { Film, Type, Square, Focus, Sparkles, MousePointer } from 'lucide-react';

type ClipBlockProps = {
  clip: VideoClip | Overlay | Effect;
  trackType: 'video' | 'overlay' | 'effect' | 'audio';
  isSelected: boolean;
  onSelect: () => void;
  pxPerFrame: number;
};

function getClipColour(trackType: string, overlayType?: string): string {
  if (trackType === 'video') return 'bg-accent/20 border-accent/40 hover:border-accent/70';
  if (overlayType === 'text') return 'bg-blue-500/20 border-blue-500/40 hover:border-blue-500/70';
  if (overlayType === 'zoom') return 'bg-purple-500/20 border-purple-500/40 hover:border-purple-500/70';
  if (overlayType === 'blur') return 'bg-orange-500/20 border-orange-500/40 hover:border-orange-500/70';
  if (overlayType === 'shape') return 'bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-500/70';
  if (overlayType === 'cursor') return 'bg-pink-500/20 border-pink-500/40 hover:border-pink-500/70';
  return 'bg-muted/20 border-muted/40';
}

function getOverlayIcon(type?: string) {
  switch (type) {
    case 'text': return <Type size={12} />;
    case 'shape': return <Square size={12} />;
    case 'blur': return <Focus size={12} />;
    case 'zoom': return <Sparkles size={12} />;
    case 'cursor': return <MousePointer size={12} />;
    default: return <Film size={12} />;
  }
}

const ClipBlockComponent: React.FC<ClipBlockProps> = ({
  clip,
  trackType,
  isSelected,
  onSelect,
  pxPerFrame,
}) => {
  const updateClip = useEditorStore((s) => s.updateClip);
  const updateOverlay = useEditorStore((s) => s.updateOverlay);
  const updateEffect = useEditorStore((s) => s.updateEffect);
  const updateAudioTrack = useEditorStore((s) => s.updateAudioTrack);

  const blockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [trimSide, setTrimSide] = useState<'left' | 'right' | null>(null);
  const dragStartRef = useRef({ x: 0, startFrame: 0, duration: 0 });

  const overlayType = 'type' in clip ? (clip as Record<string, unknown>)['type'] : undefined;
  const clipId = clip.id;
  const width = clip.durationInFrames * pxPerFrame;
  const left = clip.startFrame * pxPerFrame;

  // Drag to reposition / Trim
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = blockRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = e.clientX - rect.left;
    const trimThreshold = 10;
    const isTrimLeft = relX < trimThreshold;
    const isTrimRight = relX > rect.width - trimThreshold;

    setTrimSide(isTrimLeft ? 'left' : isTrimRight ? 'right' : null);
    setIsDragging(true);
    
    dragStartRef.current = {
      x: e.clientX,
      startFrame: clip.startFrame,
      duration: clip.durationInFrames,
    };

    const performUpdate = (updates: Partial<VideoClip & Overlay>) => {
      if (trackType === 'video') updateClip(clipId, updates as Partial<VideoClip>);
      else if (trackType === 'overlay') updateOverlay(clipId, updates as Partial<Overlay>);
      else if (trackType === 'effect') updateEffect(clipId, updates as unknown as Record<string, unknown>);
      else if (trackType === 'audio') updateAudioTrack(clipId, updates as unknown as Record<string, unknown>);
    }

    const handleMouseMove = (moveE: MouseEvent) => {
      const dx = moveE.clientX - dragStartRef.current.x;
      const dFrames = Math.round(dx / pxPerFrame);

      if (isTrimLeft) {
        const newStart = Math.max(0, dragStartRef.current.startFrame + dFrames);
        const newDuration = Math.max(1, dragStartRef.current.duration - (newStart - dragStartRef.current.startFrame));
        performUpdate({ startFrame: newStart, durationInFrames: newDuration });
      } else if (isTrimRight) {
        const newDuration = Math.max(1, dragStartRef.current.duration + dFrames);
        performUpdate({ durationInFrames: newDuration });
      } else {
        const newStart = Math.max(0, dragStartRef.current.startFrame + dFrames);
        performUpdate({ startFrame: newStart });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setTrimSide(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [clip, clipId, trackType, pxPerFrame, updateClip, updateOverlay, updateEffect, updateAudioTrack]);

  const colourClass = getClipColour(trackType, overlayType as string | undefined);
  const label = trackType === 'video'
    ? `Clip`
    : (overlayType as string | undefined) ?? 'Effect';

  return (
    <div
      ref={blockRef}
      className={`absolute top-1 bottom-1 rounded-lg border cursor-grab transition-all group/block ${colourClass} ${isSelected ? 'ring-2 ring-accent shadow-lg shadow-accent/20 z-10' : ''} ${isDragging ? 'cursor-grabbing scale-[1.01] opacity-90' : ''}`}
      style={{ left, width: Math.max(width, 4) }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
        handleMouseDown(e);
      }}
    >
      {/* Visual Trim Handles (On-screen drag) */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-center group-hover/block:bg-white/10 rounded-l-lg transition-colors ${trimSide === 'left' ? 'bg-accent/40' : ''}`}>
        <div className="w-0.5 h-4 bg-white/30 rounded-full" />
      </div>

      {/* Content */}
      <div className="flex items-center gap-1.5 px-3 h-full overflow-hidden select-none pointer-events-none">
        <span className="text-white/50 shrink-0">{getOverlayIcon(overlayType as string | undefined)}</span>
        {width > 60 && (
          <span className="font-mono text-[10px] text-white/70 font-bold truncate">
            {label}
          </span>
        )}
      </div>

      {/* Frame Tooltip during Drag/Trim */}
      {isDragging && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-surface font-mono text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-50">
          {trimSide ? `Duration: ${clip.durationInFrames}f` : `Start: ${clip.startFrame}f`}
        </div>
      )}

      <div className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-center group-hover/block:bg-white/10 rounded-r-lg transition-colors ${trimSide === 'right' ? 'bg-accent/40' : ''}`}>
        <div className="w-0.5 h-4 bg-white/30 rounded-full" />
      </div>
    </div>
  );
};

export const ClipBlock = React.memo(ClipBlockComponent, (prev, next) => {
  return (
    prev.clip.id === next.clip.id &&
    prev.clip.startFrame === next.clip.startFrame &&
    prev.clip.durationInFrames === next.clip.durationInFrames &&
    prev.isSelected === next.isSelected &&
    prev.pxPerFrame === next.pxPerFrame
  );
});
