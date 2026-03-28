import { create } from 'zustand';

export type AppStatus = 'idle' | 'recording' | 'stopped' | 'editing' | 'watching';
export type CamPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

type AppStore = {
  // Recording lifecycle
  status: AppStatus;
  setStatus: (status: AppStatus) => void;

  // Active recording
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  recSeconds: number;
  isPaused: boolean;
  
  setRecordedData: (blob: Blob | null, url: string | null) => void;
  setRecSeconds: (sec: number) => void;
  setIsPaused: (val: boolean) => void;

  // Trim state
  trimStart: number;
  trimEnd: number;
  setTrim: (start: number, end: number) => void;

  // Options
  useMic: boolean;
  useCamera: boolean;
  camPosition: CamPosition;
  toggleMic: () => void;
  toggleCamera: () => void;
  setCamPosition: (pos: CamPosition) => void;

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
  camPosition: 'bottom-left',
  toggleMic: () => set((state) => ({ useMic: !state.useMic })),
  toggleCamera: () => set((state) => ({ useCamera: !state.useCamera })),
  setCamPosition: (camPosition) => set({ camPosition }),

  shareUrl: null,
  shareModalOpen: false,
  setShareUrl: (shareUrl) => set({ shareUrl }),
  setShareModalOpen: (shareModalOpen) => set({ shareModalOpen }),

  discard: () => {
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
