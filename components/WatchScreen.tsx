import { useEffect, useState, useRef } from 'react';
import { useStorage, RecordingMetadata } from '@/hooks/useStorage';
import { formatTime } from '@/lib/format';
import { Calendar, Video, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function WatchScreen({ id }: { id: string }) {
  const { loadRecording } = useStorage();
  const { setStatus } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState<(RecordingMetadata & { videoUrl?: string }) | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await loadRecording(id);
      if (data) {
        setRecording(data);
        setBlobUrl(data.videoUrl || null);
      }
      setLoading(false);
    }
    load();
    
    return () => {
      // Cleanup object URL if needed (not needed for cloud URLs, but just in case)
      if (blobUrl && blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loadRecording]); 

  const handleLoadedMetadata = () => {
    if (videoRef.current && recording) {
      let d = videoRef.current.duration;
      if (!isFinite(d) || isNaN(d)) d = recording.duration;
      
      setDuration(d);
      videoRef.current.currentTime = recording.trimStart * d;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !recording || duration === 0) return;
    const endBoundary = recording.trimEnd * duration;
    
    if (videoRef.current.currentTime >= endBoundary) {
      videoRef.current.pause();
      // loop back to start of trim
      videoRef.current.currentTime = recording.trimStart * duration;
    }
  };

  const startFresh = () => {
    // Navigate back / reset hash
    window.location.hash = '';
    setStatus('idle');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-accent animate-pulseSlow" />
      </div>
    );
  }

  if (!recording || !blobUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center">
        <h2 className="font-syne font-bold text-3xl text-red">Recording not found</h2>
        <p className="font-mono text-muted max-w-sm">
          This cloud recording may have expired, or the ID is incorrect.
        </p>
        <button 
          onClick={startFresh}
          className="px-6 py-3 bg-accent text-surface font-syne font-bold rounded-full mt-4"
        >
          Start new recording
        </button>
      </div>
    );
  }

  const durationSec = Math.floor(recording.duration * (recording.trimEnd - recording.trimStart));
  const dateObj = new Date(recording.date);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 animate-fade-in pt-24 pb-32">
      <div className="w-full max-w-5xl flex justify-between items-end mb-6">
        <div>
          <h1 className="font-syne font-bold text-3xl md:text-4xl mb-2">Recording Viewing Session</h1>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-muted">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString()}</span>
            <span className="flex items-center gap-1.5"><Video size={14} /> {formatTime(durationSec)}</span>
          </div>
        </div>

        <button 
          onClick={startFresh}
          className="flex items-center gap-2 group text-muted hover:text-accent font-mono text-sm transition-colors py-2"
        >
          Create yours <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
        <video 
          ref={videoRef}
          src={blobUrl}
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
