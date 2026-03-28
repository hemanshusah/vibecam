import { useAppStore } from '@/store/useAppStore';

export function Header() {
  const status = useAppStore((state) => state.status);
  
  return (
    <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border">
          {/* Logo Dot */}
          <div className="w-3 h-3 bg-accent rounded-full animate-[pulseSlow_2s_infinite]" />
        </div>
        <div>
          <h1 className="font-syne font-bold text-lg leading-none tracking-tight">VibeCam</h1>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mt-0.5">no login · no friction</p>
        </div>
      </div>

      {status === 'recording' && (
        <div className="px-3 py-1.5 rounded-full bg-surface border border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red animate-[blink_1s_infinite]" />
          <span className="font-mono text-xs text-text">REC</span>
        </div>
      )}
    </header>
  );
}
