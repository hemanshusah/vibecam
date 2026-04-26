// ============================================
// VibeCam V2 — Waveform Generation Hook
// ============================================

import { useState, useEffect, useRef } from 'react';

type WaveformData = {
  peaks: number[];
  duration: number;
};

/**
 * Decode audio from a video/audio URL and generate waveform peaks.
 * Returns normalized peak data (0–1) for SVG rendering.
 */
export function useWaveform(src: string | null, samplesPerPixel: number = 128) {
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    async function generate() {
      setLoading(true);
      setError(null);

      try {
        // Fetch audio data
        const response = await fetch(src!);
        const arrayBuffer = await response.arrayBuffer();

        // Create AudioContext
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        const ctx = audioContextRef.current;

        // Decode audio
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        if (cancelled) return;

        const channelData = audioBuffer.getChannelData(0); // Use first channel
        const totalSamples = channelData.length;
        const numPeaks = Math.ceil(totalSamples / samplesPerPixel);
        const peaks: number[] = [];

        // Generate peak data
        for (let i = 0; i < numPeaks; i++) {
          const start = i * samplesPerPixel;
          const end = Math.min(start + samplesPerPixel, totalSamples);
          let max = 0;

          for (let j = start; j < end; j++) {
            const abs = Math.abs(channelData[j]);
            if (abs > max) max = abs;
          }

          peaks.push(max);
        }

        // Normalize peaks to 0–1
        const maxPeak = Math.max(...peaks, 0.001);
        const normalizedPeaks = peaks.map((p) => p / maxPeak);

        setWaveform({
          peaks: normalizedPeaks,
          duration: audioBuffer.duration,
        });
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error('Waveform generation failed:', err);
          setError('Failed to decode audio');
          setLoading(false);
        }
      }
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [src, samplesPerPixel]);

  return { waveform, loading, error };
}
