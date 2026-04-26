// ============================================
// VibeCam V2 — Cursor Highlight (Remotion)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { CursorOverlayProps } from '@/lib/remotion-types';

export const CursorHighlight: React.FC<CursorOverlayProps> = ({
  x,
  y,
  colour,
  size,
  type,
}) => {
  const frame = useCurrentFrame();

  if (type === 'ripple') {
    // Animated ripple effect
    const rippleScale = interpolate(frame % 30, [0, 30], [0.5, 2], { extrapolateRight: 'clamp' });
    const rippleOpacity = interpolate(frame % 30, [0, 30], [0.6, 0], { extrapolateRight: 'clamp' });

    return (
      <AbsoluteFill>
        {/* Static highlight */}
        <div
          style={{
            position: 'absolute',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 24 * size,
            height: 24 * size,
            borderRadius: '50%',
            backgroundColor: colour,
            opacity: 0.3,
          }}
        />
        {/* Ripple ring */}
        <div
          style={{
            position: 'absolute',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            width: 40 * size,
            height: 40 * size,
            borderRadius: '50%',
            border: `2px solid ${colour}`,
            opacity: rippleOpacity,
          }}
        />
      </AbsoluteFill>
    );
  }

  // Highlight type — static glow
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: 32 * size,
          height: 32 * size,
          borderRadius: '50%',
          backgroundColor: colour,
          opacity: 0.25,
          boxShadow: `0 0 ${20 * size}px ${10 * size}px ${colour}`,
        }}
      />
    </AbsoluteFill>
  );
};
