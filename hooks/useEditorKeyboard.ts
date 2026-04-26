// ============================================
// VibeCam V2 — Keyboard Shortcuts Hook
// ============================================

import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';
import { useEditorStore } from '@/store/useEditorStore';

/**
 * Global keyboard shortcut handler for the editor.
 * Must be called once at the editor route level.
 */
export function useEditorKeyboard() {
  const store = useEditorStore;

  useEffect(() => {
    // Allow hotkeys to fire only when NOT typing in inputs
    hotkeys.filter = (event) => {
      const target = (event.target || event.srcElement) as HTMLElement;
      const tagName = target.tagName;
      return !(tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA' || target.isContentEditable);
    };

    // Space — Play / Pause
    hotkeys('space', (e) => {
      e.preventDefault();
      const { isPlaying, setIsPlaying } = store.getState();
      setIsPlaying(!isPlaying);
    });

    // S — Split clip at playhead
    hotkeys('s', (e) => {
      e.preventDefault();
      const { selectedClipId, playheadFrame, splitClip } = store.getState();
      if (selectedClipId) {
        splitClip(selectedClipId, playheadFrame);
      }
    });

    // Delete / Backspace — Delete selected
    hotkeys('delete,backspace', (e) => {
      e.preventDefault();
      const { selectedClipId, selectedOverlayId, selectedEffectId, deleteClip, deleteOverlay, deleteEffect } = store.getState();
      if (selectedClipId) deleteClip(selectedClipId);
      else if (selectedOverlayId) deleteOverlay(selectedOverlayId);
      else if (selectedEffectId) deleteEffect(selectedEffectId);
    });

    // Cmd/Ctrl + Z — Undo
    hotkeys('command+z,ctrl+z', (e) => {
      e.preventDefault();
      store.getState().undo();
    });

    // Cmd/Ctrl + Shift + Z — Redo
    hotkeys('command+shift+z,ctrl+shift+z', (e) => {
      e.preventDefault();
      store.getState().redo();
    });

    // Cmd/Ctrl + D — Duplicate
    hotkeys('command+d,ctrl+d', (e) => {
      e.preventDefault();
      const { selectedClipId, duplicateClip } = store.getState();
      if (selectedClipId) duplicateClip(selectedClipId);
    });

    // Left / Right arrow — Step frame
    hotkeys('left', (e) => {
      e.preventDefault();
      const { playheadFrame, setPlayheadFrame } = store.getState();
      setPlayheadFrame(Math.max(0, playheadFrame - 1));
    });

    hotkeys('right', (e) => {
      e.preventDefault();
      const { playheadFrame, setPlayheadFrame } = store.getState();
      setPlayheadFrame(playheadFrame + 1);
    });

    // Shift + Left/Right — Step 10 frames
    hotkeys('shift+left', (e) => {
      e.preventDefault();
      const { playheadFrame, setPlayheadFrame } = store.getState();
      setPlayheadFrame(Math.max(0, playheadFrame - 10));
    });

    hotkeys('shift+right', (e) => {
      e.preventDefault();
      const { playheadFrame, setPlayheadFrame } = store.getState();
      setPlayheadFrame(playheadFrame + 10);
    });

    // Escape — Deselect all
    hotkeys('escape', (e) => {
      e.preventDefault();
      store.getState().deselectAll();
    });

    // Cmd/Ctrl + A — Select all clips (selects first clip)
    hotkeys('command+a,ctrl+a', (e) => {
      e.preventDefault();
      const { compositionProps, selectClip } = store.getState();
      if (compositionProps.clips.length > 0) {
        selectClip(compositionProps.clips[0].id);
      }
    });

    // I — Set in point (trim start)
    hotkeys('i', (e) => {
      e.preventDefault();
      const { selectedClipId, playheadFrame, compositionProps, updateClip } = store.getState();
      if (!selectedClipId) return;
      const clip = compositionProps.clips.find((c) => c.id === selectedClipId);
      if (!clip) return;
      const newDuration = clip.durationInFrames - (playheadFrame - clip.startFrame);
      if (newDuration > 0) {
        updateClip(selectedClipId, {
          startFrame: playheadFrame,
          durationInFrames: newDuration,
          trimFrom: clip.trimFrom + (playheadFrame - clip.startFrame),
        });
      }
    });

    // O — Set out point (trim end)
    hotkeys('o', (e) => {
      e.preventDefault();
      const { selectedClipId, playheadFrame, compositionProps, updateClip } = store.getState();
      if (!selectedClipId) return;
      const clip = compositionProps.clips.find((c) => c.id === selectedClipId);
      if (!clip) return;
      const newDuration = playheadFrame - clip.startFrame;
      if (newDuration > 0) {
        updateClip(selectedClipId, { durationInFrames: newDuration });
      }
    });

    // [ / ] — Jump to start / end of selected clip
    hotkeys('[', (e) => {
      e.preventDefault();
      const { selectedClipId, compositionProps, setPlayheadFrame: spf } = store.getState();
      if (!selectedClipId) return;
      const clip = compositionProps.clips.find((c) => c.id === selectedClipId);
      if (clip) spf(clip.startFrame);
    });

    hotkeys(']', (e) => {
      e.preventDefault();
      const { selectedClipId, compositionProps, setPlayheadFrame: spf } = store.getState();
      if (!selectedClipId) return;
      const clip = compositionProps.clips.find((c) => c.id === selectedClipId);
      if (clip) spf(clip.startFrame + clip.durationInFrames);
    });

    // E — Export
    hotkeys('e', (e) => {
      e.preventDefault();
      // Export modal trigger will be wired in Phase 6
    });

    return () => {
      hotkeys.unbind();
    };
  }, [store]);
}
