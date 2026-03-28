import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAudioMixer } from './useAudioMixer';
import { useStorage } from './useStorage';

// Module-level singletons so multiple components share the same instance
let globalStream: MediaStream | null = null;
let globalRecorder: MediaRecorder | null = null;
let globalChunks: Blob[] = [];
let globalTimer: NodeJS.Timeout | null = null;
let globalStartTimestamp: number = 0;

// Canvas compositing globals
let globalCamStream: MediaStream | null = null;
let globalDisplayStream: MediaStream | null = null;
let globalDrawInterval: ReturnType<typeof setInterval> | null = null;

export function useRecorder() {
  const store = useAppStore();
  const { mixAudio } = useAudioMixer();
  const { saveRecording } = useStorage();

  const [stream, setStream] = useState<MediaStream | null>(globalStream);

  useEffect(() => {
    setStream(globalStream);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // 1. Get Screen Stream (with system audio if possible)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });
      globalDisplayStream = displayStream;

      // Handle native "stop sharing"
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

      // 2. Get Webcam (if enabled) — this gets composited INTO the recording
      let camStream: MediaStream | null = null;
      if (store.useCamera) {
        try {
          camStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 320, frameRate: { ideal: 30 } },
          });
          globalCamStream = camStream;
        } catch (e) {
          console.warn('Camera permission denied or unavailable', e);
        }
      }

      // 3. Get Mic Audio (if enabled)
      let micStream: MediaStream | null = null;
      if (store.useMic) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          console.warn('Mic permission denied or unavailable', e);
        }
      }

      // 4. Mix audio streams
      const mixedAudioStream = mixAudio(displayStream, micStream);

      // 5. Composite video: screen + webcam circle via canvas
      let videoTrack: MediaStreamTrack;

      if (camStream) {
        // Create offscreen elements for drawing
        const screenVideo = document.createElement('video');
        screenVideo.srcObject = displayStream;
        screenVideo.muted = true;
        screenVideo.playsInline = true;
        await screenVideo.play();

        const camVideo = document.createElement('video');
        camVideo.srcObject = camStream;
        camVideo.muted = true;
        camVideo.playsInline = true;
        await camVideo.play();

        // Match canvas size to screen capture
        const screenSettings = displayStream.getVideoTracks()[0].getSettings();
        const canvas = document.createElement('canvas');
        canvas.width = screenSettings.width || 1920;
        canvas.height = screenSettings.height || 1080;
        const ctx = canvas.getContext('2d')!;

        // Draw loop — uses setInterval so it keeps running even when tab is backgrounded
        globalDrawInterval = setInterval(() => {
          // Draw screen
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

          // Draw webcam as a circle in the bottom-left corner
          const bubbleSize = Math.round(canvas.width * 0.14);
          const margin = Math.round(canvas.width * 0.02);
          const cx = margin + bubbleSize / 2;
          const cy = canvas.height - margin - bubbleSize / 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, bubbleSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          // Mirror the webcam horizontally for natural look
          ctx.translate(cx + bubbleSize / 2, cy - bubbleSize / 2);
          ctx.scale(-1, 1);
          ctx.drawImage(camVideo, 0, 0, bubbleSize, bubbleSize);
          ctx.restore();

          // White border ring
          ctx.beginPath();
          ctx.arc(cx, cy, bubbleSize / 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 3;
          ctx.stroke();
        }, 1000 / 30); // 30 fps

        const canvasStream = canvas.captureStream(30);
        videoTrack = canvasStream.getVideoTracks()[0];
      } else {
        // No camera — just record the screen directly
        videoTrack = displayStream.getVideoTracks()[0];
      }

      // 6. Build final stream
      const tracks: MediaStreamTrack[] = [videoTrack];
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
        store.setShareUrl(null);
        store.setStatus('editing');
      };

      globalRecorder = recorder;
      recorder.start(250);

      store.setRecSeconds(0);
      globalStartTimestamp = Date.now();
      globalTimer = setInterval(() => {
        store.setRecSeconds(Math.floor((Date.now() - globalStartTimestamp) / 1000));
      }, 1000);

      store.setStatus('recording');

    } catch (e) {
      console.error('Recording initialization failed', e);
    }
  }, [store.useMic, store.useCamera, mixAudio, saveRecording, store]);

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
    if (globalDrawInterval) clearInterval(globalDrawInterval);

    // Stop all streams
    if (globalDisplayStream) {
      globalDisplayStream.getTracks().forEach((t) => t.stop());
      globalDisplayStream = null;
    }
    if (globalCamStream) {
      globalCamStream.getTracks().forEach((t) => t.stop());
      globalCamStream = null;
    }
    if (globalStream) {
      globalStream.getTracks().forEach((t) => t.stop());
    }

    globalStream = null;
    globalRecorder = null;
    globalDrawInterval = null;
    setStream(null);
  }, []);

  return { startRecording, pauseRecording, resumeRecording, stopRecording, stream };
}
