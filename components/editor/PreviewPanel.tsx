"use client";

// ============================================
// VibeCam V2 — Preview Panel (Remotion Player)
// ============================================

import { useCallback, useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { VibeCamComposition } from '@/remotion/VibeCamComposition';
import { useEditorStore } from '@/store/useEditorStore';
import { getTotalDurationFrames } from '@/lib/remotion-utils';
import { formatTimecode } from '@/lib/remotion-utils';
import { Play, Pause, SkipBack, SkipForward, Maximize } from 'lucide-react';

export function PreviewPanel() {
  const playerRef = useRef<PlayerRef>(null);

  const compositionProps = useEditorStore((s) => s.compositionProps);
  const playheadFrame = useEditorStore((s) => s.playheadFrame);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setPlayheadFrame = useEditorStore((s) => s.setPlayheadFrame);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);

  const { fps, width, height } = compositionProps;

  // Calculate total duration including intro/outro
  const clipsDuration = getTotalDurationFrames(compositionProps.clips);
  const introDuration = compositionProps.intro?.durationFrames ?? 0;
  const outroDuration = compositionProps.outro?.durationFrames ?? 0;
  const totalDurationInFrames = Math.max(
    clipsDuration + introDuration + outroDuration,
    1,
  );

  // Sync playhead from Player events using ref-based listeners (Remotion 4 API)
  const handleFrameUpdate = useCallback(
    (e: { detail: { frame: number } }) => {
      setPlayheadFrame(e.detail.frame);
    },
    [setPlayheadFrame],
  );

  const handlePlay = useCallback(() => setIsPlaying(true), [setIsPlaying]);
  const handlePause = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.addEventListener('frameupdate', handleFrameUpdate as never);
    player.addEventListener('play', handlePlay as never);
    player.addEventListener('pause', handlePause as never);

    return () => {
      player.removeEventListener('frameupdate', handleFrameUpdate as never);
      player.removeEventListener('play', handlePlay as never);
      player.removeEventListener('pause', handlePause as never);
    };
  }, [handleFrameUpdate, handlePlay, handlePause]);

  // Custom controls
  const togglePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.isPlaying()) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stepBackward = () => {
    if (playerRef.current) {
      const newFrame = Math.max(0, playheadFrame - 1);
      playerRef.current.seekTo(newFrame);
      setPlayheadFrame(newFrame);
    }
  };

  const stepForward = () => {
    if (playerRef.current) {
      const newFrame = Math.min(totalDurationInFrames - 1, playheadFrame + 1);
      playerRef.current.seekTo(newFrame);
      setPlayheadFrame(newFrame);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      playerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Player Area */}
      <div className="flex-grow flex items-center justify-center bg-black p-4 relative">
        {/* Resolution badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md font-mono text-[10px] text-white/60 z-10">
          {width}×{height} · {fps}fps
        </div>

        <Player
          ref={playerRef}
          component={VibeCamComposition}
          inputProps={compositionProps}
          durationInFrames={totalDurationInFrames}
          compositionWidth={width}
          compositionHeight={height}
          fps={fps}
          style={{
            width: '100%',
            maxHeight: '100%',
            aspectRatio: `${width} / ${height}`,
          }}
          controls={false}
          loop={false}
          autoPlay={false}
          clickToPlay={false}
        />
      </div>

      {/* Custom Playback Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-t border-border">
        {/* Left: Frame counter */}
        <div className="font-mono text-xs text-muted tabular-nums w-32">
          {formatTimecode(playheadFrame, fps)}
        </div>

        {/* Centre: Play controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={stepBackward}
            className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors"
            title="Step backward"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-accent text-surface flex items-center justify-center hover:bg-white transition-colors shadow-lg shadow-accent/20"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          <button
            onClick={stepForward}
            className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors"
            title="Step forward"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Right: Fullscreen + total frames */}
        <div className="flex items-center gap-3 w-32 justify-end">
          <span className="font-mono text-xs text-muted tabular-nums">
            / {formatTimecode(totalDurationInFrames, fps)}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text transition-colors"
            title="Fullscreen"
          >
            <Maximize size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
