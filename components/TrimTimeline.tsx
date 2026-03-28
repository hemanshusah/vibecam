import { useRef, useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';

type TrimTimelineProps = {
  duration: number;
  trimStart: number;
  trimEnd: number;
  currentTime: number;
  onTrimChange: (start: number, end: number) => void;
  onSeek: (timeRatio: number) => void;
};

export function TrimTimeline({ 
  duration, 
  trimStart, 
  trimEnd, 
  currentTime,
  onTrimChange,
  onSeek
}: TrimTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  const handlePointerDown = (type: 'start' | 'end') => (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(type);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));

      if (dragging === 'start') {
        onTrimChange(Math.min(ratio, trimEnd - 0.05), trimEnd);
        onSeek(Math.min(ratio, trimEnd - 0.05));
      } else {
        onTrimChange(trimStart, Math.max(ratio, trimStart + 0.05));
        onSeek(Math.max(ratio, trimStart + 0.05));
      }
    };

    const handlePointerUp = () => setDragging(null);

    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, trimStart, trimEnd, onTrimChange, onSeek]);

  const handleTrackClick = (e: ReactMouseEvent) => {
    if (dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(trimStart, Math.min(trimEnd, ratio)));
  };

  const playheadPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="relative w-full h-16 group select-none flex flex-col justify-center">
      <div 
        ref={trackRef}
        className="absolute w-full h-12 bg-surface/50 border border-border rounded overflow-hidden cursor-pointer"
        onPointerDown={handleTrackClick}
      >
        {/* Fill Area matching trimmed bounds */}
        <div 
          className="absolute h-full bg-accent-dim border-y border-accent"
          style={{ 
            left: `${trimStart * 100}%`, 
            right: `${(1 - trimEnd) * 100}%` 
          }}
        />

        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none"
          style={{ left: `${playheadPercent}%` }}
        />
      </div>

      {/* Handles */}
      <div 
        className="absolute top-0 bottom-0 w-4 bg-accent rounded shadow cursor-ew-resize z-30 touch-none flex items-center justify-center -ml-2"
        style={{ left: `${trimStart * 100}%` }}
        onPointerDown={handlePointerDown('start')}
      >
        <div className="w-0.5 h-6 bg-black/40 rounded-full" />
      </div>

      <div 
        className="absolute top-0 bottom-0 w-4 bg-accent rounded shadow cursor-ew-resize z-30 touch-none flex items-center justify-center -ml-2"
        style={{ left: `${trimEnd * 100}%` }}
        onPointerDown={handlePointerDown('end')}
      >
        <div className="w-0.5 h-6 bg-black/40 rounded-full" />
      </div>
    </div>
  );
}
