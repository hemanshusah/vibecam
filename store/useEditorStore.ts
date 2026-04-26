// ============================================
// VibeCam V2 — Editor Zustand Store
// ============================================

import { create } from 'zustand';
import { produce } from 'immer';
import {
  CompositionProps,
  VideoClip,
  Overlay,
  Effect,
  AudioTrack,
  IntroConfig,
  OutroConfig,
  DEFAULT_FPS,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
} from '@/lib/remotion-types';

// --- Store Type ---
type EditorStore = {
  // Composition state (source of truth for Remotion)
  compositionProps: CompositionProps;

  // Selection
  selectedClipId: string | null;
  selectedOverlayId: string | null;
  selectedEffectId: string | null;

  // Playback
  playheadFrame: number;
  isPlaying: boolean;
  playbackSpeed: number;

  // Timeline
  zoom: number; // 1–10
  scrollOffset: number;

  // Undo/Redo
  history: CompositionProps[];
  historyIndex: number;

  // Recording metadata
  recordingId: string | null;
  recordingTitle: string;

  // UI State
  activeSidebarTab: 'media' | 'audio' | 'overlays' | 'effects' | 'none';
  isSidebarOpen: boolean;

  // --- Actions ---

  // Initialise
  initComposition: (props: CompositionProps, recordingId: string, title: string) => void;

  // Clips
  addClip: (clip: VideoClip) => void;
  updateClip: (id: string, updates: Partial<VideoClip>) => void;
  splitClip: (clipId: string, atFrame: number) => void;
  deleteClip: (clipId: string) => void;
  duplicateClip: (clipId: string) => void;

  // Overlays
  addOverlay: (overlay: Overlay) => void;
  updateOverlay: (id: string, updates: Partial<Overlay>) => void;
  deleteOverlay: (id: string) => void;

  // Effects
  addEffect: (effect: Effect) => void;
  updateEffect: (id: string, updates: Partial<Effect>) => void;
  deleteEffect: (id: string) => void;

  // Audio
  addAudioTrack: (track: AudioTrack) => void;
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  deleteAudioTrack: (id: string) => void;

  // Intro / Outro
  setIntro: (intro: IntroConfig | null) => void;
  setOutro: (outro: OutroConfig | null) => void;

  // Selection
  selectClip: (id: string | null) => void;
  selectOverlay: (id: string | null) => void;
  selectEffect: (id: string | null) => void;
  deselectAll: () => void;

  // Playback
  setPlayheadFrame: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Timeline
  setZoom: (zoom: number) => void;
  setScrollOffset: (offset: number) => void;

  // Composition settings
  setFps: (fps: number) => void;
  setResolution: (width: number, height: number) => void;
  setRecordingTitle: (title: string) => void;

  // UI State
  setActiveSidebarTab: (tab: 'media' | 'audio' | 'overlays' | 'effects' | 'none') => void;
  setSidebarOpen: (open: boolean) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

// --- History helpers ---
const MAX_HISTORY = 50;

function pushHistory(state: EditorStore): void {
  // Trim forward history on new change
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.compositionProps)));

  // Cap at MAX_HISTORY
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  state.history = newHistory;
  state.historyIndex = newHistory.length - 1;
}

// --- Store ---
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  compositionProps: {
    clips: [],
    overlays: [],
    effects: [],
    audioTracks: [],
    intro: null,
    outro: null,
    fps: DEFAULT_FPS,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  selectedClipId: null,
  selectedOverlayId: null,
  selectedEffectId: null,
  playheadFrame: 0,
  isPlaying: false,
  playbackSpeed: 1,
  zoom: 1,
  scrollOffset: 0,
  history: [],
  historyIndex: -1,
  recordingId: null,
  recordingTitle: 'Untitled Recording',

  activeSidebarTab: 'media',
  isSidebarOpen: true,

  // --- Initialise ---
  initComposition: (props, recordingId, title) =>
    set(
      produce((state: EditorStore) => {
        state.compositionProps = props;
        state.recordingId = recordingId;
        state.recordingTitle = title;
        state.selectedClipId = null;
        state.selectedOverlayId = null;
        state.selectedEffectId = null;
        state.playheadFrame = 0;
        state.isPlaying = false;
        state.history = [JSON.parse(JSON.stringify(props))];
        state.historyIndex = 0;
      }),
    ),

  // --- Clips ---
  addClip: (clip) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.clips.push(clip);
      }),
    ),

  updateClip: (id, updates) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        const clip = state.compositionProps.clips.find((c: VideoClip) => c.id === id);
        if (clip) Object.assign(clip, updates);
      }),
    ),

  splitClip: (clipId, atFrame) =>
    set(
      produce((state: EditorStore) => {
        const clipIndex = state.compositionProps.clips.findIndex(
          (c: VideoClip) => c.id === clipId,
        );
        if (clipIndex === -1) return;

        const clip = state.compositionProps.clips[clipIndex];
        const relativeFrame = atFrame - clip.startFrame;

        if (relativeFrame <= 0 || relativeFrame >= clip.durationInFrames) return;

        pushHistory(state);

        // Create two clips from the original
        const clipA: VideoClip = {
          ...clip,
          durationInFrames: relativeFrame,
          trimTo: clip.trimFrom + relativeFrame,
        };

        const clipB: VideoClip = {
          ...clip,
          id: `${clip.id}-split-${Date.now()}`,
          startFrame: clip.startFrame + relativeFrame,
          durationInFrames: clip.durationInFrames - relativeFrame,
          trimFrom: clip.trimFrom + relativeFrame,
        };

        state.compositionProps.clips.splice(clipIndex, 1, clipA, clipB);
      }),
    ),

  deleteClip: (clipId) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.clips = state.compositionProps.clips.filter(
          (c: VideoClip) => c.id !== clipId,
        );
        if (state.selectedClipId === clipId) {
          state.selectedClipId = null;
        }
      }),
    ),

  duplicateClip: (clipId) =>
    set(
      produce((state: EditorStore) => {
        const clip = state.compositionProps.clips.find((c: VideoClip) => c.id === clipId);
        if (!clip) return;

        pushHistory(state);

        const newClip: VideoClip = {
          ...clip,
          id: `${clip.id}-dup-${Date.now()}`,
          startFrame: clip.startFrame + clip.durationInFrames,
        };
        state.compositionProps.clips.push(newClip);
      }),
    ),

  // --- Overlays ---
  addOverlay: (overlay) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.overlays.push(overlay);
      }),
    ),

  updateOverlay: (id, updates) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        const overlay = state.compositionProps.overlays.find((o: Overlay) => o.id === id);
        if (overlay) Object.assign(overlay, updates);
      }),
    ),

  deleteOverlay: (id) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.overlays = state.compositionProps.overlays.filter(
          (o: Overlay) => o.id !== id,
        );
        if (state.selectedOverlayId === id) {
          state.selectedOverlayId = null;
        }
      }),
    ),

  // --- Effects ---
  addEffect: (effect) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.effects.push(effect);
      }),
    ),

  updateEffect: (id, updates) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        const effect = state.compositionProps.effects.find((e: Effect) => e.id === id);
        if (effect) Object.assign(effect, updates);
      }),
    ),

  deleteEffect: (id) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.effects = state.compositionProps.effects.filter(
          (e: Effect) => e.id !== id,
        );
        if (state.selectedEffectId === id) {
          state.selectedEffectId = null;
        }
      }),
    ),

  // --- Audio ---
  addAudioTrack: (track) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.audioTracks.push(track);
      }),
    ),

  updateAudioTrack: (id, updates) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        const track = state.compositionProps.audioTracks.find(
          (t: AudioTrack) => t.id === id,
        );
        if (track) Object.assign(track, updates);
      }),
    ),

  deleteAudioTrack: (id) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.audioTracks = state.compositionProps.audioTracks.filter(
          (t: AudioTrack) => t.id !== id,
        );
      }),
    ),

  // --- Intro / Outro ---
  setIntro: (intro) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.intro = intro;
      }),
    ),

  setOutro: (outro) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.outro = outro;
      }),
    ),

  // --- Selection ---
  selectClip: (id) =>
    set({ selectedClipId: id, selectedOverlayId: null, selectedEffectId: null }),
  selectOverlay: (id) =>
    set({ selectedClipId: null, selectedOverlayId: id, selectedEffectId: null }),
  selectEffect: (id) =>
    set({ selectedClipId: null, selectedOverlayId: null, selectedEffectId: id }),
  deselectAll: () =>
    set({ selectedClipId: null, selectedOverlayId: null, selectedEffectId: null }),

  // --- Playback ---
  setPlayheadFrame: (frame) => set({ playheadFrame: frame }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // --- Timeline ---
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(10, zoom)) }),
  setScrollOffset: (offset) => set({ scrollOffset: offset }),

  // --- Composition Settings ---
  setFps: (fps) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.fps = fps;
      }),
    ),

  setResolution: (width, height) =>
    set(
      produce((state: EditorStore) => {
        pushHistory(state);
        state.compositionProps.width = width;
        state.compositionProps.height = height;
      }),
    ),

  setRecordingTitle: (title) => set({ recordingTitle: title }),

  // --- UI State ---
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // --- Undo / Redo ---
  undo: () =>
    set(
      produce((state: EditorStore) => {
        if (state.historyIndex > 0) {
          state.historyIndex -= 1;
          state.compositionProps = JSON.parse(
            JSON.stringify(state.history[state.historyIndex]),
          );
        }
      }),
    ),

  redo: () =>
    set(
      produce((state: EditorStore) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          state.compositionProps = JSON.parse(
            JSON.stringify(state.history[state.historyIndex]),
          );
        }
      }),
    ),

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}));
