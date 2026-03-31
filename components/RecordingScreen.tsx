import { useEffect, useRef } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { useAppStore } from '@/store/useAppStore';
import { formatTime } from '@/lib/format';
import { Square, Pause, Play } from 'lucide-react';

export function RecordingScreen() {
  const { stream, stopRecording, pauseRecording, resumeRecording } = useRecorder();
  const { recSeconds, isPaused } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = new MediaStream([stream.getVideoTracks()[0]]);
    }
  }, [stream]);

  // Bind ESC to stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopRecording();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopRecording]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-32 space-y-8 animate-fade-in">
      <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-border shadow-2xl bg-black">
        <video 
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Rec Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-400 aspect-square rounded-none' : 'bg-red animate-blink'}`} />
          <span className="font-mono text-sm font-medium tracking-widest text-white/90">
            {isPaused ? 'PAUSED' : formatTime(recSeconds)}
          </span>
        </div>
      </div>

      {/* Controls container */}
      <div className="flex items-center gap-6">
        
        {/* Pause/Resume button */}
        <button
          onClick={isPaused ? resumeRecording : pauseRecording}
          className={`group relative flex items-center justify-center w-20 h-20 rounded-2xl border transition-all duration-300 ${
            isPaused 
              ? 'bg-accent/10 border-accent hover:bg-accent/20' 
              : 'bg-surface border-border hover:border-yellow-400'
          }`}
        >
          {isPaused ? (
            <Play className="w-8 h-8 text-accent fill-accent" />
          ) : (
             <Pause className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          )}
          <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-muted whitespace-nowrap">
            {isPaused ? 'resume recording' : 'pause recording'}
          </div>
        </button>

        {/* Existing Stop button */}
        <button
          onClick={stopRecording}
          className="group relative flex items-center justify-center w-20 h-20 rounded-2xl bg-surface border border-border hover:border-red transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-2xl bg-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Square className="w-8 h-8 text-red fill-red" />
          
          {/* Tooltip */}
          <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-muted whitespace-nowrap">
            press ESC to stop
          </div>
        </button>
      </div>

      <div className="pt-8 font-mono text-xs text-muted">
        Built by{' '}
        <a
          href="https://linkedin.com/in/himanshusah"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-white transition-colors"
        >
          Himanshu Sah - LinkedIn
        </a>
        ! 👋
      </div>
    </div>
  );
}
