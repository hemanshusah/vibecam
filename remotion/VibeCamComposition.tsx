// ============================================
// VibeCam V2 — Root Remotion Composition
// ============================================

import { AbsoluteFill, Sequence, Audio } from 'remotion';
import type { CompositionProps, TextOverlayProps, ZoomOverlayProps, BlurOverlayProps, ShapeOverlayProps, CursorOverlayProps } from '@/lib/remotion-types';
import { VideoClipComponent } from './VideoClip';
import { TextOverlay } from './overlays/TextOverlay';
import { ZoomPanEffect } from './overlays/ZoomPanEffect';
import { BlurOverlay } from './overlays/BlurOverlay';
import { ShapeOverlay } from './overlays/ShapeOverlay';
import { CursorHighlight } from './overlays/CursorHighlight';
import { DarkMinimalIntro } from './sequences/intros/DarkMinimalIntro';
import { GradientBurstIntro } from './sequences/intros/GradientBurstIntro';
import { CallToActionOutro } from './sequences/outros/CallToActionOutro';

/**
 * Root Remotion composition — renders the full video.
 * All user edits map to this single composition tree.
 */
export const VibeCamComposition: React.FC<CompositionProps> = ({
  clips,
  overlays,
  effects,
  audioTracks,
  intro,
  outro,
}) => {
  const maxFrame = clips.length > 0
    ? Math.max(...clips.map((c) => c.startFrame + c.durationInFrames))
    : 0;
  const introOffset = intro?.durationFrames ?? 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1. Intro sequence */}
      {intro && (
        <Sequence durationInFrames={intro.durationFrames}>
          {intro.style === 'darkMinimal' ? (
            <DarkMinimalIntro {...intro} />
          ) : (
            <GradientBurstIntro {...intro} />
          )}
        </Sequence>
      )}

      {/* 2. Main content container — Flattened for performance */}
      <AbsoluteFill>
        {/* Video clips — Bottom Layer */}
        {clips.map((clip) => (
          <Sequence
            key={clip.id}
            from={clip.startFrame + introOffset}
            durationInFrames={clip.durationInFrames}
          >
            <VideoClipComponent
              src={clip.src}
              trimFrom={clip.trimFrom}
              trimTo={clip.trimTo}
              speed={clip.speed}
              volume={clip.volume}
            />
          </Sequence>
        ))}

        {/* Audio tracks — Invisible Layer */}
        {audioTracks.map((track) => (
          <Sequence
            key={track.id}
            from={track.startFrame + introOffset}
            durationInFrames={track.durationInFrames}
          >
            <Audio src={track.src} volume={track.volume} muted={track.muted} />
          </Sequence>
        ))}

        {/* Overlays & Effects — Top Layers */}
        {overlays.map((overlay) => (
          <Sequence
            key={overlay.id}
            from={overlay.startFrame + introOffset}
            durationInFrames={overlay.durationInFrames}
          >
            <OverlayRenderer type={overlay.type} props={overlay.props} />
          </Sequence>
        ))}

        {effects.map((effect) => (
          <Sequence
            key={effect.id}
            from={effect.startFrame + introOffset}
            durationInFrames={effect.durationInFrames}
          >
            <EffectRenderer type={effect.type} config={effect.config as any} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {/* 3. Outro sequence */}
      {outro && (
        <Sequence
          from={maxFrame + introOffset}
          durationInFrames={outro.durationFrames}
        >
          <CallToActionOutro {...outro} />
        </Sequence>
      )}
      {/* 4. Permanent Watermark (Burned-in) */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#FF3B3F', // Accent color
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 'bold',
            fontSize: '10px',
          }}>V</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 'bold', fontSize: '14px', color: '#fff', lineHeight: 1 }}>VibeCam</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>vibecam.dazuservices.com</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Effect Renderer ---
function EffectRenderer({ type, config }: { type: string; config: any }) {
  let filter = '';
  const intensity = config.intensity ?? 1;

  switch (type) {
    case 'grayscale': filter = `grayscale(${intensity})`; break;
    case 'sepia': filter = `sepia(${intensity})`; break;
    case 'invert': filter = `invert(${intensity})`; break;
    case 'blur': filter = `blur(${config.radius ?? 5}px)`; break;
    case 'brightness': filter = `brightness(${intensity + 1})`; break;
    case 'contrast': filter = `contrast(${intensity + 1})`; break;
    case 'hueRotate': filter = `hue-rotate(${config.angle ?? 90}deg)`; break;
    default: return null;
  }

  return (
    <AbsoluteFill style={{ backdropFilter: filter, pointerEvents: 'none' }} />
  );
}

// --- Overlay Dispatcher ---
function OverlayRenderer({ type, props }: { type: string; props: Record<string, unknown> }) {
  switch (type) {
    case 'text':
      return <TextOverlay {...(props as unknown as TextOverlayProps)} />;
    case 'zoom':
      return <ZoomPanEffect {...(props as unknown as ZoomOverlayProps)} />;
    case 'blur':
      return <BlurOverlay {...(props as unknown as BlurOverlayProps)} />;
    case 'shape':
      return <ShapeOverlay {...(props as unknown as ShapeOverlayProps)} />;
    case 'cursor':
      return <CursorHighlight {...(props as unknown as CursorOverlayProps)} />;
    default:
      return null;
  }
}
