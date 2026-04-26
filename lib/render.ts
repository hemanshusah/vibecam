// ============================================
// VibeCam V2 — Render API Helpers
// ============================================

import type { CompositionProps } from './remotion-types';

export type RenderConfig = {
  composition: CompositionProps;
  resolution: string;
  format: 'mp4' | 'gif';
  quality: 'high' | 'medium' | 'low';
  title: string;
};

export type RenderStatus = {
  status: 'queued' | 'rendering' | 'done' | 'failed';
  progress: number;
  outputUrl?: string;
  error?: string;
};

/**
 * Trigger a new render job
 */
export async function triggerRender(config: RenderConfig): Promise<{ renderId: string }> {
  const res = await fetch('/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to start render');
  }

  return res.json();
}

/**
 * Poll render status by ID
 */
export async function getRenderStatus(renderId: string): Promise<RenderStatus> {
  const res = await fetch(`/api/render/${renderId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch render status');
  }

  return res.json();
}

/**
 * Poll render with interval, calling callback on each update
 */
export function pollRenderStatus(
  renderId: string,
  onUpdate: (status: RenderStatus) => void,
  intervalMs: number = 2000,
): () => void {
  const interval = setInterval(async () => {
    try {
      const status = await getRenderStatus(renderId);
      onUpdate(status);

      if (status.status === 'done' || status.status === 'failed') {
        clearInterval(interval);
      }
    } catch {
      clearInterval(interval);
      onUpdate({ status: 'failed', progress: 0, error: 'Lost connection' });
    }
  }, intervalMs);

  return () => clearInterval(interval);
}
