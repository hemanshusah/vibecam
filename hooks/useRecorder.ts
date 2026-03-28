import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAudioMixer } from './useAudioMixer';
import { useStorage } from './useStorage';

// Module-level singletons so multiple components (IdleScreen, RecordingScreen) share the same instance
let globalStream: MediaStream | null = null;
let globalRecorder: MediaRecorder | null = null;
let globalChunks: Blob[] = [];
let globalTimer: NodeJS.Timeout | null = null;
let globalStartTimestamp: number = 0;

export function useRecorder() {
  const store = useAppStore();
  const { mixAudio } = useAudioMixer();
  const { saveRecording } = useStorage();

  const [stream, setStream] = useState<MediaStream | null>(globalStream);

  // Sync internal state with globalStream if it changes outside
  useEffect(() => {
    setStream(globalStream);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // 1. Get Screen Stream (with system audio if possible)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 } },
        audio: true, // Request system audio
      });

      // Handle native "stop sharing"
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

      // 2. Get Mic Audio (if enabled)
      let micStream: MediaStream | null = null;
      if (store.useMic) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          console.warn('Mic permission denied or unavailable', e);
        }
      }

      // 3. Mix audio streams
      const mixedAudioStream = mixAudio(displayStream, micStream);

      // 4. Combine Video and Mixed Audio
      const tracks: MediaStreamTrack[] = [displayStream.getVideoTracks()[0]];
      if (mixedAudioStream && mixedAudioStream.getAudioTracks().length > 0) {
        tracks.push(mixedAudioStream.getAudioTracks()[0]);
      }
      const finalStream = new MediaStream(tracks);

      globalStream = finalStream;
      setStream(finalStream);
      globalChunks = [];

      // Determine ideal mimetype
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      let selectedMime = mimeTypes[0];
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const recorder = new MediaRecorder(finalStream, { mimeType: selectedMime });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) globalChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const finalBlob = new Blob(globalChunks, { type: selectedMime });
        const objectUrl = URL.createObjectURL(finalBlob);
        
        store.setRecordedData(finalBlob, objectUrl);

        // We DO NOT upload yet. Wait for user to click 'Share'.
        // We clear shareUrl here because it will be generated upon upload.
        store.setShareUrl(null); 
        store.setStatus('editing');
      };

      globalRecorder = recorder;
      recorder.start(250); // timeslice 250ms chunks

      store.setRecSeconds(0);
      globalStartTimestamp = Date.now();
      globalTimer = setInterval(() => {
        store.setRecSeconds(Math.floor((Date.now() - globalStartTimestamp) / 1000));
      }, 1000);

      store.setStatus('recording');
      
    } catch (e) {
      console.error('Recording initialization failed', e);
    }
  }, [store.useMic, mixAudio, saveRecording, store]);

  const pauseRecording = useCallback(() => {
    if (globalRecorder && globalRecorder.state === 'recording') {
      globalRecorder.pause();
      store.setIsPaused(true);
      if (globalTimer) clearInterval(globalTimer);
    }
  }, [store]);

  const resumeRecording = useCallback(() => {
    if (globalRecorder && globalRecorder.state === 'paused') {
      globalRecorder.resume();
      store.setIsPaused(false);
      
      // Resume timer logic
      const adjustedStartTime = Date.now() - (store.recSeconds * 1000);
      globalStartTimestamp = adjustedStartTime;
      globalTimer = setInterval(() => {
        store.setRecSeconds(Math.floor((Date.now() - globalStartTimestamp) / 1000));
      }, 1000);
    }
  }, [store]);

  const stopRecording = useCallback(() => {
    if (globalRecorder && (globalRecorder.state === 'recording' || globalRecorder.state === 'paused')) {
      globalRecorder.stop();
    }
    if (globalTimer) clearInterval(globalTimer);

    if (globalStream) {
      globalStream.getTracks().forEach((t) => t.stop());
    }
    globalStream = null;
    globalRecorder = null;
    setStream(null);
  }, []);

  return { startRecording, pauseRecording, resumeRecording, stopRecording, stream };
}
