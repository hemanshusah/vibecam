"use client";

// ============================================
// VibeCam V2 — Playhead (Vertical Red Line)
// ============================================

import { useEditorStore } from '@/store/useEditorStore';

export function Playhead({ onMouseDown }: { onMouseDown?: (e: React.MouseEvent) => void }) {
  const playheadFrame = useEditorStore((s) => s.playheadFrame);
  const zoom = useEditorStore((s) => s.zoom);
  const fps = useEditorStore((s) => s.compositionProps.fps);

  const pxPerFrame = (zoom * 60) / fps;
  const x = playheadFrame * pxPerFrame;

  return (
    <div
      className="absolute top-0 bottom-0 z-30 cursor-col-resize group"
      style={{ left: x, transform: 'translateX(-0.5px)' }}
      onMouseDown={onMouseDown}
    >
      {/* Hit area for easier dragging */}
      <div className="absolute top-0 bottom-0 -left-2 -right-2 pointer-events-auto" />
      {/* Playhead marker (triangle) */}
      <div
        className="absolute -top-0 left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid #FF4545',
        }}
      />
      {/* Vertical line */}
      <div className="w-px h-full bg-red" />
    </div>
  );
}
