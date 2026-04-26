import { useState } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { Video } from 'lucide-react';
import { PreRecordingModal } from './PreRecordingModal';

export function IdleScreen() {
  const { startRecording } = useRecorder();
  const [modalMode, setModalMode] = useState<'recording' | 'video' | null>(null);

  const handleOpenModal = (mode: 'recording' | 'video') => {
    setModalMode(mode);
  };

  const handleStart = async () => {
    if (modalMode) {
      try {
        await startRecording(modalMode);
        setModalMode(null);
      } catch (err) {
        console.error("Failed to start recording:", err);
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-around p-6 pt-28 pb-12 animate-fade-in">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h2 className="font-syne text-5xl md:text-7xl font-bold tracking-tight text-text">
            Share your screen in seconds.
          </h2>
          <p className="font-mono text-muted text-sm md:text-base max-w-md mx-auto">
            Zero installs. Zero logins. Just hit record and get a shareable link instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={() => handleOpenModal('recording')}
            className="w-full sm:w-auto px-10 py-4 bg-accent text-surface font-syne font-bold text-lg rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/20 group flex items-center justify-center gap-2"
          >
            <Video size={20} className="group-hover:scale-110 transition-transform" />
            Start Recording
          </button>

          <div className="relative group/video-only w-full sm:w-auto">
            <button
              onClick={() => handleOpenModal('video')}
              className="w-full sm:w-auto px-10 py-4 bg-surface border border-border text-text font-syne font-bold text-lg rounded-2xl hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
            >
              Record Video Only
            </button>
            {/* Hover Description Tooltip */}
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-48 bg-surface border border-border p-2 rounded-lg shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/video-only:opacity-100 group-hover/video-only:translate-y-0 transition-all z-10">
               <p className="font-mono text-[10px] text-muted leading-tight">
                  Record just yourself using the webcam. No screen sharing.
               </p>
            </div>
          </div>
        </div>

        <div className="pt-12 font-mono text-xs text-muted">
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

      {modalMode && (
        <PreRecordingModal 
          mode={modalMode} 
          onClose={() => setModalMode(null)} 
          onConfirm={handleStart} 
        />
      )}
    </div>
  );
}
