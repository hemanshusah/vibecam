import { useAppStore } from '@/store/useAppStore';
import { useRecorder } from '@/hooks/useRecorder';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

export function IdleScreen() {
  const { useMic, useCamera, toggleMic, toggleCamera } = useAppStore();
  const { startRecording } = useRecorder();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h2 className="font-syne text-5xl md:text-7xl font-bold tracking-tight text-text">
            Share your screen in seconds.
          </h2>
          <p className="font-mono text-muted text-sm md:text-base max-w-md mx-auto">
            Zero installs. Zero logins. Just hit record and get a shareable link instantly.
          </p>
        </div>

        <button
          onClick={startRecording}
          className="w-full sm:w-auto px-10 py-4 bg-accent text-surface font-syne font-bold text-lg rounded-full hover:bg-white transition-colors duration-200 shadow-[0_0_40px_var(--color-accent-dim)]"
        >
          Start Recording
        </button>

        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={toggleMic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-colors ${
              useMic ? 'bg-surface border-border text-accent' : 'bg-transparent text-muted hover:text-text'
            } border border-transparent hover:border-border`}
          >
            {useMic ? <Mic size={16} /> : <MicOff size={16} />}
            Mic {useMic ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-colors ${
              useCamera ? 'bg-surface border-border text-accent' : 'bg-transparent text-muted hover:text-text'
            } border border-transparent hover:border-border`}
          >
            {useCamera ? <Video size={16} /> : <VideoOff size={16} />}
            Cam {useCamera ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
