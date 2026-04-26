// ============================================
// VibeCam V2 — Gradient Burst Intro (Remotion)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { IntroConfig } from '@/lib/remotion-types';

export const GradientBurstIntro: React.FC<IntroConfig> = ({
  title,
  subtitle,
  colours,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animated gradient rotation
  const gradientAngle = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Title scale-in with spring
  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 150 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
  const titleOpacity = titleSpring;

  // Subtitle appear
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [20, 35], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const primary = colours.primary || '#E8FF47';
  const secondary = colours.secondary || '#7C3AED';

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${primary}20, ${secondary}20, #0A0A0B)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}15, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 64,
          fontWeight: 700,
          color: '#F0F0F2',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.1,
          zIndex: 1,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 20,
          color: primary,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 20,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
