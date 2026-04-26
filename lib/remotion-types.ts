// ============================================
// VibeCam V2 — Remotion Composition Type System
// ============================================

// --- Video Clip ---
export type VideoClip = {
  id: string;
  src: string;                   // Video URL (Blob URL or R2 CDN URL)
  startFrame: number;            // Position on timeline (in frames)
  durationInFrames: number;      // Duration on timeline (in frames)
  trimFrom: number;              // Source trim start (in frames)
  trimTo: number;                // Source trim end (in frames)
  speed: number;                 // Playback speed multiplier (default 1)
  volume: number;                // 0–1
};

// --- Overlay Types ---
export type OverlayType = 'text' | 'shape' | 'blur' | 'zoom' | 'cursor';

export type TextOverlayProps = {
  text: string;
  fontFamily: 'Syne' | 'Geist Mono' | 'Inter' | 'Arial';
  fontSize: number;
  fontWeight: 'regular' | 'bold';
  colour: string;                // hex + opacity
  alignment: 'left' | 'center' | 'right';
  background: 'none' | 'solid' | 'frosted';
  backgroundColour?: string;
  x: number;                     // 0–1 ratio of canvas width
  y: number;                     // 0–1 ratio of canvas height
  entranceAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'scaleIn';
  exitAnimation: 'none' | 'fadeOut' | 'slideDown' | 'scaleOut';
};

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow';

export type ShapeOverlayProps = {
  shapeType: ShapeType;
  fillColour: string;
  strokeColour: string;
  strokeWidth: number;
  opacity: number;               // 0–1
  cornerRadius?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  // For arrows
  endX?: number;
  endY?: number;
};

export type BlurOverlayProps = {
  blurRadius: number;            // 4–40
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ZoomOverlayProps = {
  zoomLevel: number;             // 100–400 (percent)
  centreX: number;               // 0–1
  centreY: number;               // 0–1
  easing: 'linear' | 'ease-in-out' | 'spring';
};

export type CursorOverlayProps = {
  x: number;
  y: number;
  colour: string;
  size: number;                  // 1, 1.5, 2
  type: 'highlight' | 'ripple';
};

export type OverlayProps =
  | TextOverlayProps
  | ShapeOverlayProps
  | BlurOverlayProps
  | ZoomOverlayProps
  | CursorOverlayProps;

export type Overlay = {
  id: string;
  type: OverlayType;
  startFrame: number;
  durationInFrames: number;
  props: OverlayProps;
};

// --- Effects ---
export type EffectType = 'zoomPan' | 'blur' | 'grayscale' | 'sepia' | 'invert' | 'hueRotate' | 'brightness' | 'contrast';

export type Effect = {
  id: string;
  type: EffectType;
  startFrame: number;
  durationInFrames: number;
  config: {
    intensity?: number;      // 0–1 or 0–100
    angle?: number;          // for hueRotate
    radius?: number;         // for blur
  };
};

// --- Audio ---
export type GainPoint = {
  frame: number;
  gain: number;                  // 0–1
};

export type AudioTrack = {
  id: string;
  src: string;
  startFrame: number;
  durationInFrames: number;
  volume: number;                // 0–1
  gainPoints: GainPoint[];
  fadeIn: number;                // frames
  fadeOut: number;               // frames
  muted: boolean;
};

// --- Intro / Outro ---
export type IntroStyle = 'darkMinimal' | 'gradientBurst';

export type IntroConfig = {
  style: IntroStyle;
  title: string;
  subtitle: string;
  durationFrames: number;        // 60–180 frames (2–6 sec at 30fps)
  colours: {
    primary: string;
    secondary: string;
  };
};

export type OutroStyle = 'callToAction';

export type OutroConfig = {
  style: OutroStyle;
  ctaText: string;
  ctaUrl: string;
  durationFrames: number;
};

// --- Root Composition Props ---
export type CompositionProps = {
  clips: VideoClip[];
  overlays: Overlay[];
  effects: Effect[];
  audioTracks: AudioTrack[];
  intro: IntroConfig | null;
  outro: OutroConfig | null;
  fps: number;                   // default 30
  width: number;                 // default 1920
  height: number;                // default 1080
};

// --- Helpers ---
export const DEFAULT_FPS = 30;
export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;

export function toFrames(sec: number, fps: number = DEFAULT_FPS): number {
  return Math.round(sec * fps);
}

export function toSeconds(frames: number, fps: number = DEFAULT_FPS): number {
  return frames / fps;
}

export function createEmptyComposition(
  videoSrc: string,
  durationSec: number,
  fps: number = DEFAULT_FPS,
): CompositionProps {
  const durationInFrames = toFrames(durationSec, fps);
  return {
    clips: [
      {
        id: 'clip-0',
        src: videoSrc,
        startFrame: 0,
        durationInFrames,
        trimFrom: 0,
        trimTo: durationInFrames,
        speed: 1,
        volume: 1,
      },
    ],
    overlays: [],
    effects: [],
    audioTracks: [],
    intro: null,
    outro: null,
    fps,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  };
}
