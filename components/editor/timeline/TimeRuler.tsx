"use client";

// ============================================
// VibeCam V2 — Time Ruler (Timeline Header)
// ============================================

import { useEditorStore } from '@/store/useEditorStore';
import { formatTimeLabel } from '@/lib/remotion-utils';

export function TimeRuler() {
  const zoom = useEditorStore((s) => s.zoom);
  const fps = useEditorStore((s) => s.compositionProps.fps);
  const clips = useEditorStore((s) => s.compositionProps.clips);
  const intro = useEditorStore((s) => s.compositionProps.intro);
  const outro = useEditorStore((s) => s.compositionProps.outro);

  const clipsDuration = clips.length > 0
    ? Math.max(...clips.map((c) => c.startFrame + c.durationInFrames))
    : 0;
  const totalFrames = clipsDuration + (intro?.durationFrames ?? 0) + (outro?.durationFrames ?? 0);
  const totalSeconds = totalFrames / fps;

  // Pixels per second based on zoom
  const pxPerSecond = zoom * 60;
  const totalWidth = Math.max(totalSeconds * pxPerSecond + 200, 800);

  // Tick interval based on zoom
  const tickInterval = zoom >= 3 ? 0.5 : zoom >= 1.5 ? 1 : 2;
  const ticks: number[] = [];
  for (let s = 0; s <= totalSeconds + 5; s += tickInterval) {
    ticks.push(s);
  }

  return (
    <div
      className="h-7 border-b border-border relative select-none"
      style={{ width: totalWidth }}
    >
      {ticks.map((sec) => {
        const x = sec * pxPerSecond;
        const isMajor = sec % 1 === 0;
        return (
          <div key={sec} className="absolute top-0" style={{ left: x }}>
            <div
              className={`w-px ${isMajor ? 'h-3 bg-muted/60' : 'h-2 bg-border'}`}
              style={{ marginTop: isMajor ? 0 : 4 }}
            />
            {isMajor && (
              <span className="absolute top-3 left-0.5 font-mono text-[9px] text-muted/50 whitespace-nowrap">
                {formatTimeLabel(sec)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
