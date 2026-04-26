"use client";

// ============================================
// VibeCam V2 — Track Lane (Single Track Row)
// ============================================

import { ReactNode } from 'react';
import { Volume2, Eye, Film, Sparkles, Lock, Unlock } from 'lucide-react';

type TrackLaneProps = {
  label: string;
  type: 'video' | 'audio' | 'overlay' | 'effect';
  height: number;
  children: ReactNode;
  muted?: boolean;
  locked?: boolean;
  onToggleMute?: () => void;
  onToggleLock?: () => void;
};

function getTrackIcon(type: string) {
  switch (type) {
    case 'video': return <Film size={13} />;
    case 'audio': return <Volume2 size={13} />;
    case 'overlay': return <Eye size={13} />;
    case 'effect': return <Sparkles size={13} />;
    default: return <Film size={13} />;
  }
}

export function TrackLane({
  label,
  type,
  height,
  children,
  muted = false,
  locked = false,
  onToggleMute,
  onToggleLock,
}: TrackLaneProps) {
  return (
    <div className="flex border-b border-border/50" style={{ height }}>
      {/* Track label column */}
      <div className="w-[120px] shrink-0 flex items-center gap-2 px-3 border-r border-border/50 bg-surface/50">
        <span className={`text-muted/60 ${muted ? 'opacity-30' : ''}`}>
          {getTrackIcon(type)}
        </span>
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="ml-auto flex gap-1">
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className={`p-0.5 rounded hover:bg-bg/50 ${muted ? 'text-red/60' : 'text-muted/40 hover:text-muted/80'}`}
              title={muted ? 'Unmute' : 'Mute'}
            >
              <Volume2 size={10} />
            </button>
          )}
          {onToggleLock && (
            <button
              onClick={onToggleLock}
              className={`p-0.5 rounded hover:bg-bg/50 ${locked ? 'text-accent/60' : 'text-muted/40 hover:text-muted/80'}`}
              title={locked ? 'Unlock' : 'Lock'}
            >
              {locked ? <Lock size={10} /> : <Unlock size={10} />}
            </button>
          )}
        </div>
      </div>

      {/* Track content area */}
      <div className="flex-grow relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
