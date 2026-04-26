import { useAppStore, CamPosition } from '@/store/useAppStore';
import { Mic, MicOff, Video, VideoOff, X, Play } from 'lucide-react';

const positions: { value: CamPosition; label: string }[] = [
  { value: 'top-left', label: 'TL' },
  { value: 'top-right', label: 'TR' },
  { value: 'bottom-left', label: 'BL' },
  { value: 'bottom-right', label: 'BR' },
];

export function PreRecordingModal({ 
  mode, 
  onClose, 
  onConfirm 
}: { 
  mode: 'recording' | 'video', 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  const { useMic, useCamera, toggleMic, toggleCamera, camPosition, setCamPosition } = useAppStore();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface border border-border shadow-2xl rounded-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="font-syne font-bold text-xl">Recording Settings</h3>
             <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
               {mode === 'recording' ? 'Screen + Camera' : 'Selfie Video Only'}
             </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted">
            <X size={20} />
          </button>
        </div>

        {/* Settings */}
        <div className="p-8 space-y-8">
           {/* Mic/Cam Toggles */}
           <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMic}
                className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                  useMic ? 'bg-accent/10 border-accent text-accent' : 'bg-bg border-border text-muted hover:border-border-light'
                }`}
              >
                {useMic ? <Mic size={24} /> : <MicOff size={24} />}
                <span className="font-syne font-bold text-xs">Mic {useMic ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                  useCamera || mode === 'video' ? 'bg-accent/10 border-accent text-accent' : 'bg-bg border-border text-muted hover:border-border-light'
                }`}
                disabled={mode === 'video'} // Camera is mandatory for video mode
              >
                {(useCamera || mode === 'video') ? <Video size={24} /> : <VideoOff size={24} />}
                <span className="font-syne font-bold text-xs">Camera { (useCamera || mode === 'video') ? 'ON' : 'OFF'}</span>
              </button>
           </div>

           {/* Camera Position (only if camera is active or mode is recording) */}
           {(mode === 'recording' && useCamera) && (
             <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                   <label className="font-syne font-bold text-xs">Camera Position</label>
                   <span className="font-mono text-[10px] text-muted decoration-accent underline underline-offset-4">{camPosition.replace('-', ' ')}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => setCamPosition(pos.value)}
                      className={`py-3 rounded-xl font-mono font-bold text-[10px] transition-all border ${
                        camPosition === pos.value 
                          ? 'bg-accent border-accent text-surface shadow-lg shadow-accent/20' 
                          : 'bg-bg border-border text-muted hover:border-accent/40'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
             </div>
           )}

           {/* Instructions */}
           <div className="bg-bg/50 border border-border/50 p-4 rounded-xl">
              <p className="font-mono text-[10px] text-muted leading-relaxed">
                {mode === 'recording' 
                  ? 'You will be prompted to select a screen or window to share. Make sure to enable system audio if needed.' 
                  : 'Start your personal video message. Ensure your lighting is good!'}
              </p>
           </div>
        </div>

        {/* Action */}
        <div className="p-6 bg-bg/30 border-t border-border">
           <button 
             onClick={onConfirm}
             className="w-full py-4 bg-accent text-surface font-syne font-bold rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
           >
             <Play size={20} className="fill-surface" />
             Start Recording
           </button>
        </div>
      </div>
    </div>
  );
}
