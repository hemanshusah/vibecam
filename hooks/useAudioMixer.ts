// Mixes mic audio and system audio into a single MediaStreamDestination

export function useAudioMixer() {
  const mixAudio = (systemAudioStream: MediaStream | null, micAudioStream: MediaStream | null): MediaStream | null => {
    if (!systemAudioStream && !micAudioStream) return null;

    const sysHasAudio = systemAudioStream && systemAudioStream.getAudioTracks().length > 0;
    const micHasAudio = micAudioStream && micAudioStream.getAudioTracks().length > 0;

    if (!sysHasAudio && !micHasAudio) return null;

    // Fast path: only one source
    if (sysHasAudio && !micHasAudio) return new MediaStream([systemAudioStream.getAudioTracks()[0]]);
    if (micHasAudio && !sysHasAudio) return new MediaStream([micAudioStream.getAudioTracks()[0]]);

    // Mix both
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();

      if (sysHasAudio) {
        const sysSource = audioCtx.createMediaStreamSource(systemAudioStream);
        sysSource.connect(dest);
      }

      if (micHasAudio) {
        const micSource = audioCtx.createMediaStreamSource(micAudioStream);
        micSource.connect(dest);
      }

      return dest.stream;
    } catch (e) {
      console.error('Audio mixing failed, falling back to mic only', e);
      return micHasAudio ? new MediaStream([micAudioStream!.getAudioTracks()[0]]) : null;
    }
  };

  return { mixAudio };
}
