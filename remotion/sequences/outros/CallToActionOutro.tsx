// ============================================
// VibeCam V2 — Call To Action Outro (Remotion)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { OutroConfig } from '@/lib/remotion-types';

export const CallToActionOutro: React.FC<OutroConfig> = ({
  ctaText,
  ctaUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // CTA text spring
  const ctaSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });

  // URL fade in
  const urlOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Brand bar animation
  const barWidth = interpolate(frame, [0, 20], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Fade out at end
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
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
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: `${barWidth}px`,
          height: 3,
          backgroundColor: '#E8FF47',
          borderRadius: 2,
          marginBottom: 40,
        }}
      />

      {/* CTA Text */}
      <h2
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 36,
          fontWeight: 700,
          color: '#F0F0F2',
          opacity: ctaSpring,
          transform: `scale(${interpolate(ctaSpring, [0, 1], [0.9, 1])})`,
          textAlign: 'center',
          margin: 0,
          maxWidth: '80%',
        }}
      >
        {ctaText || 'Watch the full recording at vibecam.app'}
      </h2>

      {/* URL */}
      {ctaUrl && (
        <p
          style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: 16,
            color: '#E8FF47',
            opacity: urlOpacity,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          {ctaUrl}
        </p>
      )}

      {/* VibeCam branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: urlOpacity,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#E8FF47',
          }}
        />
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 14,
            color: '#6B6B75',
            fontWeight: 600,
          }}
        >
          VibeCam
        </span>
      </div>
    </AbsoluteFill>
  );
};
