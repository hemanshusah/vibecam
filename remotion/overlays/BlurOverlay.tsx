// ============================================
// VibeCam V2 — Blur/Redaction Overlay (Remotion)
// ============================================

import { AbsoluteFill } from 'remotion';
import type { BlurOverlayProps } from '@/lib/remotion-types';

export const BlurOverlay: React.FC<BlurOverlayProps> = ({
  blurRadius,
  x,
  y,
  width,
  height,
}) => {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: `${width * 100}%`,
          height: `${height * 100}%`,
          backdropFilter: `blur(${blurRadius}px)`,
          WebkitBackdropFilter: `blur(${blurRadius}px)`,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
    </AbsoluteFill>
  );
};
