// ============================================
// VibeCam V2 — Dark Minimal Intro (Remotion)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { IntroConfig } from '@/lib/remotion-types';

export const DarkMinimalIntro: React.FC<IntroConfig> = ({
  title,
  subtitle,
  colours,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animated dot pulse
  const dotScale = spring({ frame: frame, fps, config: { damping: 10, stiffness: 100 } });

  // Title fade in (0–20 frames)
  const titleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [10, 25], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle slide up (15–35 frames)
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [20, 35], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Fade out at end
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Animated VibeCam dot */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: colours.primary || '#E8FF47',
          marginBottom: 24,
          transform: `scale(${dotScale})`,
          boxShadow: `0 0 20px ${colours.primary || '#E8FF47'}40`,
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 56,
          fontWeight: 700,
          color: '#F0F0F2',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 18,
          color: '#6B6B75',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
