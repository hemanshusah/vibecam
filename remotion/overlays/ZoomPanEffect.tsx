// ============================================
// VibeCam V2 — Zoom & Pan Effect (Remotion)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { ZoomOverlayProps } from '@/lib/remotion-types';

export const ZoomPanEffect: React.FC<ZoomOverlayProps> = ({
  zoomLevel,
  centreX,
  centreY,
  easing,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoomFactor = zoomLevel / 100;
  const zoomInDuration = Math.min(Math.floor(durationInFrames * 0.2), 20);
  const zoomOutStart = durationInFrames - zoomInDuration;

  let progress: number;

  if (easing === 'spring') {
    const springIn = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
    const springOut = spring({ frame: frame - zoomOutStart, fps, config: { damping: 15, stiffness: 120 } });

    if (frame < zoomInDuration) {
      progress = springIn;
    } else if (frame >= zoomOutStart) {
      progress = 1 - springOut;
    } else {
      progress = 1;
    }
  } else {
    const inProgress = interpolate(frame, [0, zoomInDuration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const outProgress = interpolate(frame, [zoomOutStart, durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    if (frame < zoomInDuration) {
      progress = easing === 'ease-in-out' ? easeInOut(inProgress) : inProgress;
    } else if (frame >= zoomOutStart) {
      progress = easing === 'ease-in-out' ? easeInOut(outProgress) : outProgress;
    } else {
      progress = 1;
    }
  }

  const currentZoom = interpolate(progress, [0, 1], [1, zoomFactor]);
  const translateX = -(centreX - 0.5) * (currentZoom - 1) * 100;
  const translateY = -(centreY - 0.5) * (currentZoom - 1) * 100;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${currentZoom}) translate(${translateX}%, ${translateY}%)`,
        transformOrigin: `${centreX * 100}% ${centreY * 100}%`,
      }}
    />
  );
};

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
