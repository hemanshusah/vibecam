import { set, get } from 'idb-keyval';
import { useCallback } from 'react';

export type RecordingMetadata = {
  id: string; // e.g. "rec_123456789"
  date: string; // ISO 8601
  duration: number; // total seconds (pre-trim)
  trimStart: number; // 0-1 ratio
  trimEnd: number; // 0-1 ratio
  mimeType: string;
  hasMic: boolean;
  hasCamera: boolean;
};

// We store the blob in IDB. Storing raw blob is well supported in idb-keyval.
export type RecordingStorageItem = RecordingMetadata & {
  blob: Blob;
};

export function useStorage() {
  const saveRecording = useCallback(async (item: RecordingStorageItem) => {
    try {
      await set(item.id, item);
      return item.id;
    } catch (e) {
      console.error('Failed to save to IndexedDB', e);
      throw e;
    }
  }, []);

  const loadRecording = useCallback(async (id: string): Promise<RecordingStorageItem | undefined> => {
    try {
      return await get(id);
    } catch (e) {
      console.error('Failed to load from IndexedDB', e);
      return undefined;
    }
  }, []);

  return { saveRecording, loadRecording };
}
