import { create } from 'zustand';

export type AppStatus = 'idle' | 'recording' | 'stopped' | 'editing' | 'watching';

type AppStore = {
  // Recording lifecycle
  status: AppStatus;
  setStatus: (status: AppStatus) => void;

  // Active recording
  recordedBlob: Blob | null;
  recordedUrl: string | null; // ObjectURL
  recSeconds: number;
  isPaused: boolean;
  
  setRecordedData: (blob: Blob | null, url: string | null) => void;
  setRecSeconds: (sec: number) => void;
  setIsPaused: (val: boolean) => void;

  // Trim state
  trimStart: number; // 0–1
  trimEnd: number;   // 0–1
  setTrim: (start: number, end: number) => void;

  // Options
  useMic: boolean;
  useCamera: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;

  // Share
  shareUrl: string | null;
  shareModalOpen: boolean;
  setShareUrl: (url: string | null) => void;
  setShareModalOpen: (open: boolean) => void;

  // Global Actions
  discard: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status }),

  recordedBlob: null,
  recordedUrl: null,
  recSeconds: 0,
  isPaused: false,
  
  setRecordedData: (recordedBlob, recordedUrl) => set({ recordedBlob, recordedUrl }),
  setRecSeconds: (recSeconds) => set({ recSeconds }),
  setIsPaused: (isPaused) => set({ isPaused }),

  trimStart: 0,
  trimEnd: 1,
  setTrim: (trimStart, trimEnd) => set({ trimStart, trimEnd }),

  useMic: false,
  useCamera: false,
  toggleMic: () => set((state) => ({ useMic: !state.useMic })),
  toggleCamera: () => set((state) => ({ useCamera: !state.useCamera })),

  shareUrl: null,
  shareModalOpen: false,
  setShareUrl: (shareUrl) => set({ shareUrl }),
  setShareModalOpen: (shareModalOpen) => set({ shareModalOpen }),

  discard: () => {
    // Note: URL.revokeObjectURL is handled in the components / hooks, but state resets here
    set({
      status: 'idle',
      recordedBlob: null,
      recordedUrl: null,
      recSeconds: 0,
      isPaused: false,
      trimStart: 0,
      trimEnd: 1,
      shareUrl: null,
      shareModalOpen: false,
    });
  },
}));
