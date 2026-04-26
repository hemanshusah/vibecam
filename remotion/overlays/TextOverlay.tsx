// ============================================
// VibeCam V2 — Text Overlay (Remotion Component)
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { TextOverlayProps } from '@/lib/remotion-types';

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  fontFamily,
  fontSize,
  fontWeight,
  colour,
  alignment,
  background,
  backgroundColour,
  x,
  y,
  entranceAnimation,
  exitAnimation,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation (first 15 frames)
  const entranceDuration = 15;
  let entranceOpacity = 1;
  let entranceTransform = 'none';

  switch (entranceAnimation) {
    case 'fadeIn':
      entranceOpacity = interpolate(frame, [0, entranceDuration], [0, 1], { extrapolateRight: 'clamp' });
      break;
    case 'slideUp':
      entranceOpacity = interpolate(frame, [0, entranceDuration], [0, 1], { extrapolateRight: 'clamp' });
      const slideUpY = interpolate(frame, [0, entranceDuration], [30, 0], { extrapolateRight: 'clamp' });
      entranceTransform = `translateY(${slideUpY}px)`;
      break;
    case 'slideLeft':
      entranceOpacity = interpolate(frame, [0, entranceDuration], [0, 1], { extrapolateRight: 'clamp' });
      const slideLeftX = interpolate(frame, [0, entranceDuration], [-40, 0], { extrapolateRight: 'clamp' });
      entranceTransform = `translateX(${slideLeftX}px)`;
      break;
    case 'scaleIn': {
      const scaleProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
      entranceOpacity = scaleProgress;
      entranceTransform = `scale(${interpolate(scaleProgress, [0, 1], [0.5, 1])})`;
      break;
    }
  }

  // Exit animation (last 15 frames)
  const exitStart = durationInFrames - 15;
  let exitOpacity = 1;
  let exitTransform = 'none';

  if (frame >= exitStart) {
    switch (exitAnimation) {
      case 'fadeOut':
        exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
        break;
      case 'slideDown':
        exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
        const slideDownY = interpolate(frame, [exitStart, durationInFrames], [0, 30], { extrapolateLeft: 'clamp' });
        exitTransform = `translateY(${slideDownY}px)`;
        break;
      case 'scaleOut':
        exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
        const scaleOutVal = interpolate(frame, [exitStart, durationInFrames], [1, 0.5], { extrapolateLeft: 'clamp' });
        exitTransform = `scale(${scaleOutVal})`;
        break;
    }
  }

  const opacity = entranceOpacity * exitOpacity;
  const transform = frame < entranceDuration ? entranceTransform : exitTransform;

  const bgStyles: React.CSSProperties = {};
  if (background === 'solid') {
    bgStyles.backgroundColor = backgroundColour || 'rgba(0,0,0,0.6)';
    bgStyles.padding = '8px 16px';
    bgStyles.borderRadius = '8px';
  } else if (background === 'frosted') {
    bgStyles.backgroundColor = 'rgba(0,0,0,0.3)';
    bgStyles.backdropFilter = 'blur(12px)';
    bgStyles.padding = '8px 16px';
    bgStyles.borderRadius = '8px';
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: `translate(-50%, -50%) ${transform}`,
          opacity,
          fontFamily: fontFamily === 'Geist Mono' ? 'Geist Mono, monospace' : `${fontFamily}, sans-serif`,
          fontSize,
          fontWeight: fontWeight === 'bold' ? 700 : 400,
          color: colour,
          textAlign: alignment,
          whiteSpace: 'pre-wrap',
          ...bgStyles,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
