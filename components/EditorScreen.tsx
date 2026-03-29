import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useStorage } from '@/hooks/useStorage';
import { useAuth } from '@/context/AuthProvider';
import { TrimTimeline } from './TrimTimeline';
import { formatTime } from '@/lib/format';
import { Share, Trash2, Play, Download, Pencil } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { AuthModal } from './AuthModal';

export function EditorScreen() {
  const { recordedUrl, recordedBlob, useMic, useCamera, trimStart, trimEnd, setTrim, discard, shareUrl, setShareUrl, setShareModalOpen, shareModalOpen } = useAppStore();
  const { saveRecording } = useStorage();
  const { user } = useAuth();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const { recSeconds } = useAppStore(); // fallback for Infinity bug
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(false);
  const [videoTitle, setVideoTitle] = useState('Untitled Recording');

  useEffect(() => {
    if (videoRef.current && recordedUrl) {
      videoRef.current.src = recordedUrl;
    }
  }, [recordedUrl]);

  // Auto-trigger upload after successful auth if user had clicked "Upload & Share"
  useEffect(() => {
    if (user && pendingUpload) {
      setPendingUpload(false);
      doUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingUpload]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      let d = videoRef.current.duration;
      if (!isFinite(d) || isNaN(d)) d = Math.max(recSeconds, 1);
      
      setDuration(d);
      videoRef.current.currentTime = trimStart * d;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const ct = videoRef.current.currentTime;
    setCurrentTime(ct);

    const endBoundary = trimEnd * duration;
    const startBoundary = trimStart * duration;

    // Boundary constraints
    if (duration > 0) {
      if (ct >= endBoundary) {
        videoRef.current.pause();
        setIsPlaying(false);
        videoRef.current.currentTime = startBoundary;
      } else if (ct < startBoundary) {
        videoRef.current.currentTime = startBoundary;
      }
    }
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrimChange = (start: number, end: number) => {
    setTrim(start, end);
    if (videoRef.current) {
      videoRef.current.currentTime = start * duration;
    }
  };

  const handleSeek = (ratio: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = ratio * duration;
    }
  };

  const doUpload = async () => {
    if (!recordedBlob || !user) return;

    try {
      setIsUploading(true);
      const newId = await saveRecording({
        title: videoTitle,
        date: new Date().toISOString(),
        duration: recSeconds,
        trimStart,
        trimEnd,
        mimeType: recordedBlob.type,
        hasMic: useMic,
        hasCamera: useCamera,
        blob: recordedBlob,
        userId: user.id,
      });

      if (newId) {
        setShareUrl(newId);
        setShareModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to upload recording.", e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShareClick = async () => {
    if (shareUrl) {
      setShareModalOpen(true);
      return;
    }

    // Auth gate: show inline modal instead of navigating away
    if (!user) {
      setPendingUpload(true);
      setShowAuthModal(true);
      return;
    }

    await doUpload();
  };

  const handleDownload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecam-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // pendingUpload + user change will trigger the useEffect above
  };

  if (!recordedUrl) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in pb-32">
      
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-syne font-bold text-2xl">Edit & Share</h2>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1.5 group cursor-text">
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="bg-transparent font-mono text-sm text-muted outline-none border-b border-transparent focus:border-accent/40 hover:border-border transition-colors max-w-[200px]"
              placeholder="Recording title"
            />
            <Pencil size={10} className="text-muted/40 group-hover:text-muted transition-colors" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={discard} className="flex items-center gap-2 px-4 py-2 hover:bg-surface border border-transparent hover:border-border text-muted hover:text-red transition-all rounded-full font-mono text-sm">
            <Trash2 size={16} /> Discard
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text hover:border-accent/30 hover:text-accent font-mono text-sm rounded-full transition-all"
          >
            <Download size={16} /> Download
          </button>
          <button 
            onClick={handleShareClick} 
            disabled={isUploading}
            className={`flex items-center gap-2 px-6 py-2 bg-accent text-surface hover:bg-white font-syne font-bold rounded-full transition-colors shadow-lg shadow-accent/20 ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isUploading ? <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" /> : <Share size={16} />}
            {isUploading ? 'Uploading...' : (shareUrl ? 'Share' : 'Upload & Share')}
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-border bg-black shadow-2xl group">
        <video 
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain"
          onClick={togglePlayback}
        />
        
        {/* Simple inline native-like play button layer */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-20 h-20 bg-black/50 backdrop-blur rounded-full flex items-center justify-center border border-white/20 pl-2">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Editor Controls bottom panel */}
      <div className="w-full max-w-5xl bg-surface p-6 rounded-2xl border border-border shadow-xl space-y-6">
        <div className="flex justify-between font-mono text-xs text-muted mb-2">
          <span>{formatTime(trimStart * duration)}</span>
          <span>{formatTime(trimEnd * duration)}</span>
        </div>
        
        <TrimTimeline 
          duration={duration} 
          trimStart={trimStart} 
          trimEnd={trimEnd} 
          currentTime={currentTime}
          onTrimChange={handleTrimChange}
          onSeek={handleSeek}
        />
      </div>

      {shareModalOpen && <ShareModal />}
      {showAuthModal && (
        <AuthModal
          onClose={() => { setShowAuthModal(false); setPendingUpload(false); }}
          onSuccess={handleAuthSuccess}
        />
      )}

      <div className="pt-4 font-mono text-xs text-muted">
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
