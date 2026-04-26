import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Copy, Check, X, Scissors } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ShareModal() {
  const { shareUrl, setShareModalOpen, setStatus } = useAppStore();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}/#watch:${shareUrl}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      
      // Auto-redirect to editor after successful copy
      setTimeout(() => {
        setCopied(false);
        setShareModalOpen(false);
        setStatus('idle');
        router.push(`/edit/${shareUrl}`);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShareModalOpen(false)}
      />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={() => setShareModalOpen(false)}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors"
        >
          <X size={20} />
        </button>
        
        <h3 className="font-syne font-bold text-2xl mb-2">Share recording</h3>
        <p className="font-mono text-xs text-muted mb-6">
          Cloud upload complete. Anyone with this link can view your recording.
        </p>

        <div className="flex items-center gap-2 p-1.5 bg-black border border-border rounded-lg mb-4">
          <input 
            type="text" 
            readOnly 
            value={fullUrl}
            className="flex-1 bg-transparent font-mono text-xs text-text px-3 outline-none"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs rounded-md transition-all ${
              copied ? 'bg-[#4ADE80] text-black font-bold' : 'bg-surface hover:bg-border text-text'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <Link 
          href={`/edit/${shareUrl}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-surface font-syne font-bold text-sm rounded-xl transition-all shadow-sm"
          onClick={() => setShareModalOpen(false)}
        >
          <Scissors size={16} /> Edit with Timeline
        </Link>
      </div>
    </div>
  );
}
