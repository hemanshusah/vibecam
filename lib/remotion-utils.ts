// ============================================
// VibeCam V2 — Frame ↔ Time Utility Helpers
// ============================================

import { DEFAULT_FPS } from './remotion-types';

/**
 * Format a frame number as HH:MM:SS:FF timecode
 */
export function formatTimecode(frame: number, fps: number = DEFAULT_FPS): string {
  const totalSeconds = Math.floor(frame / fps);
  const remainingFrames = Math.floor(frame % fps);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number, len: number = 2) => n.toString().padStart(len, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(remainingFrames)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}:${pad(remainingFrames)}`;
}

/**
 * Format seconds as MM:SS.ms (for timeline ruler labels)
 */
export function formatTimeLabel(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  return `${secs}.${ms.toString().padStart(2, '0')}s`;
}

/**
 * Calculate total duration of all clips in frames
 */
export function getTotalDurationFrames(
  clips: { startFrame?: number; durationInFrames?: number }[] | undefined | null,
): number {
  if (!clips || !Array.isArray(clips) || clips.length === 0) return 0;
  return Math.max(...clips.map((c) => (c?.startFrame || 0) + (c?.durationInFrames || 0)));
}

/**
 * Convert pixel position on timeline to frame number
 */
export function pixelToFrame(
  px: number,
  zoom: number,
): number {
  // Each second at zoom=1 is (fps * 2) pixels wide
  const pixelsPerFrame = zoom * 2;
  return Math.round(px / pixelsPerFrame);
}

/**
 * Convert frame number to pixel position on timeline
 */
export function frameToPixel(
  frame: number,
  zoom: number,
): number {
  const pixelsPerFrame = zoom * 2;
  return frame * pixelsPerFrame;
}

/**
 * Snap a frame to the nearest grid boundary
 */
export function snapFrame(
  frame: number,
  snapTargets: number[],
  threshold: number = 5,
): number {
  for (const target of snapTargets) {
    if (Math.abs(frame - target) <= threshold) {
      return target;
    }
  }
  return frame;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
