import Link from 'next/link';

export function Watermark() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
      <Link 
        href="https://vibecam.dazuservices.com" 
        target="_blank"
        className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/60 transition-all group"
      >
        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-surface font-syne font-bold text-[8px] shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">V</div>
        <div className="flex flex-col -space-y-0.5">
           <span className="font-syne font-bold text-[10px] text-white tracking-tight">VibeCam</span>
           <span className="font-mono text-[7px] text-white/50">vibecam.dazuservices.com</span>
        </div>
      </Link>
    </div>
  );
}
