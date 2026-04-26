// ============================================
// VibeCam V2 — Timeline Zoom Hook
// ============================================

import { useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

/**
 * Handles timeline zoom via Ctrl+Wheel, pinch, and +/- keys.
 * Call once at the editor level.
 */
export function useTimelineZoom() {
  const setZoom = useEditorStore((s) => s.setZoom);

  const handleZoom = useCallback(
    (delta: number) => {
      const current = useEditorStore.getState().zoom;
      const newZoom = Math.max(0.5, Math.min(10, current + delta));
      setZoom(newZoom);
    },
    [setZoom],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoom(0.5);
      }
      if (e.key === '-') {
        e.preventDefault();
        handleZoom(-0.5);
      }
      // Ctrl/Cmd + 0 = reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoom, setZoom]);

  return { handleZoom };
}
