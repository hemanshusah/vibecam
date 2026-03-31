import { useAppStore, CamPosition } from '@/store/useAppStore';
import { useRecorder } from '@/hooks/useRecorder';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const positions: { value: CamPosition; label: string }[] = [
  { value: 'top-left', label: 'TL' },
  { value: 'top-right', label: 'TR' },
  { value: 'bottom-left', label: 'BL' },
  { value: 'bottom-right', label: 'BR' },
];

export function IdleScreen() {
  const { useMic, useCamera, toggleMic, toggleCamera, camPosition, setCamPosition } = useAppStore();
  const { startRecording } = useRecorder();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 md:pt-32 animate-fade-in">
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-colors ${useMic ? 'bg-surface border-border text-accent' : 'bg-transparent text-muted hover:text-text'
              } border border-transparent hover:border-border`}
          >
            {useMic ? <Mic size={16} /> : <MicOff size={16} />}
            Mic {useMic ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-colors ${useCamera ? 'bg-surface border-border text-accent' : 'bg-transparent text-muted hover:text-text'
              } border border-transparent hover:border-border`}
          >
            {useCamera ? <Video size={16} /> : <VideoOff size={16} />}
            Cam {useCamera ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Camera position picker — only visible when camera is ON */}
        {useCamera && (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <span className="font-mono text-xs text-muted">Camera position</span>
            <div className="grid grid-cols-2 gap-1.5 w-20 h-20 p-2 bg-surface border border-border rounded-xl">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setCamPosition(pos.value)}
                  className={`rounded-md text-[10px] font-mono font-bold transition-all ${camPosition === pos.value
                    ? 'bg-accent text-surface scale-105'
                    : 'bg-black/30 text-muted hover:bg-black/50 hover:text-text'
                    }`}
                  title={pos.value}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
}
