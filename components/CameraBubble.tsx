import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function CameraBubble() {
  const { useCamera, status } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState(false);
  
  // Drag state
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 24, y: 24 }); // Base bottom-left or custom
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const isActive = useCamera && (status === 'idle' || status === 'recording');

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isCancelled = false;

    if (isActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320 } })
        .then((s) => {
          if (!isCancelled) {
            currentStream = s;
            setStream(s);
          } else {
            s.getTracks().forEach(t => t.stop());
          }
        })
        .catch(e => {
          console.warn('Camera failed', e);
          if (!isCancelled) setError(true);
        });
    } else {
      setStream(null);
      setError(false);
    }
    
    return () => {
      isCancelled = true;
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!bubbleRef.current) return;
    isDragging.current = true;
    
    const rect = bubbleRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    bubbleRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !bubbleRef.current) return;
    
    // Calculate new top/left
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    
    // Bounds check
    const maxX = window.innerWidth - bubbleRef.current.offsetWidth;
    const maxY = window.innerHeight - bubbleRef.current.offsetHeight;
    
    setPos({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (bubbleRef.current) bubbleRef.current.releasePointerCapture(e.pointerId);
  };

  if (!useCamera || (status !== 'idle' && status !== 'recording')) return null;

  return (
    <div
      ref={bubbleRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed z-50 w-40 h-40 rounded-full overflow-hidden bg-black border-2 border-surface shadow-2xl transition-all duration-100 ease-out cursor-grab active:cursor-grabbing ${
        isDragging.current ? 'shadow-accent/20 scale-105' : ''
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        touchAction: 'none'
      }}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-red-dim text-red font-mono text-[10px] text-center p-4">
          Camera Failed
        </div>
      ) : (
        <video 
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          autoPlay 
          playsInline 
          muted 
        />
      )}
    </div>
  );
}
