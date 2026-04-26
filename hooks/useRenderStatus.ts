// ============================================
// VibeCam V2 — Render Status Polling Hook
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import type { RenderStatus } from '@/lib/render';

export function useRenderStatus() {
  const [renderId, setRenderId] = useState<string | null>(null);
  const [status, setStatus] = useState<RenderStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback((id: string) => {
    setRenderId(id);
    setIsPolling(true);
    setStatus({ status: 'queued', progress: 0 });
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPolling || !renderId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/render/${renderId}`);
        const data: RenderStatus = await res.json();
        setStatus(data);

        if (data.status === 'done' || data.status === 'failed') {
          stopPolling();
        }
      } catch {
        setStatus({ status: 'failed', progress: 0, error: 'Connection lost' });
        stopPolling();
      }
    };

    // Poll immediately, then every 2 seconds
    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPolling, renderId, stopPolling]);

  return {
    renderId,
    status,
    isPolling,
    startPolling,
    stopPolling,
  };
}
