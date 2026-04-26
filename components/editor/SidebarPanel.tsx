"use client";

// ============================================
// VibeCam V2 — Sidebar Content Panel
// ============================================

import { useEditorStore } from '@/store/useEditorStore';
import { 
  Plus, 
  Upload, 
  Music, 
  Type, 
  Square, 
  Eye, 
  ZoomIn, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { nanoid } from 'nanoid';
import type { 
  Overlay, 
  TextOverlayProps, 
  ZoomOverlayProps, 
  BlurOverlayProps, 
  ShapeOverlayProps,
  AudioTrack
} from '@/lib/remotion-types';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';

interface Recording {
  id: string;
  title: string;
  video_url: string;
  duration: number;
}

export function SidebarPanel() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const activeTab = useEditorStore((s) => s.activeSidebarTab);
  const playheadFrame = useEditorStore((s) => s.playheadFrame);
  const fps = useEditorStore((s) => s.compositionProps.fps);
  const addOverlay = useEditorStore((s) => s.addOverlay);
  const addClip = useEditorStore((s) => s.addClip);
  const addAudioTrack = useEditorStore((s) => s.addAudioTrack);
  const compositionProps = useEditorStore((s) => s.compositionProps);
  const deleteAudioTrack = useEditorStore((s) => s.deleteAudioTrack);

  const audioInputRef = useRef<HTMLInputElement>(null);

  const fetchUserMedia = useCallback(async () => {
    if (!user) return;
    setLoadingMedia(true);
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setRecordings(data);
    setLoadingMedia(false);
  }, [user]);

  useEffect(() => {
    if (activeTab === 'media' && user) {
      fetchUserMedia();
    }
  }, [activeTab, user, fetchUserMedia]);

  const handleAddMedia = (rec: Recording) => {
    addClip({
      id: `clip-${nanoid(8)}`,
      src: rec.video_url,
      startFrame: playheadFrame,
      durationInFrames: Math.round(rec.duration * fps),
      trimFrom: 0,
      trimTo: Math.round(rec.duration * fps),
      speed: 1,
      volume: 1,
    });
  };

  const handleAddText = () => {
    const overlay: Overlay = {
      id: `text-${nanoid(8)}`,
      type: 'text',
      startFrame: playheadFrame,
      durationInFrames: fps * 3,
      props: {
        text: 'Your text here',
        fontFamily: 'Syne',
        fontSize: 48,
        fontWeight: 'bold',
        colour: '#FFFFFF',
        alignment: 'center',
        background: 'none',
        x: 0.5,
        y: 0.5,
        entranceAnimation: 'fadeIn',
        exitAnimation: 'fadeOut',
      } as TextOverlayProps,
    };
    addOverlay(overlay);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please upload a valid audio file (MP3, WAV, etc.)');
        return;
      }
      
      const url = URL.createObjectURL(file);
      const track: AudioTrack = {
        id: `audio-${nanoid(8)}`,
        src: url,
        startFrame: playheadFrame,
        durationInFrames: fps * 30, // Default 30s or use metadata duration
        volume: 1,
        gainPoints: [],
        fadeIn: 0,
        fadeOut: 0,
        muted: false,
      };
      addAudioTrack(track);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Tab Title */}
      <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
        {activeTab === 'media' && <><Plus size={14} className="text-accent" /> Media Library</>}
        {activeTab === 'audio' && <><Music size={14} className="text-accent" /> Audio</>}
        {activeTab === 'overlays' && <><Type size={14} className="text-accent" /> Elements</>}
        {activeTab === 'effects' && <><Sparkles size={14} className="text-accent" /> Effects</>}
      </h3>

      {/* Content based on tab */}
      <div className="flex-grow space-y-4 overflow-y-auto pr-1">
        
        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] text-muted leading-relaxed">
              Click to add a recording to the timeline.
            </p>
            
            {loadingMedia ? (
              <div className="flex justify-center py-8">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recordings.length === 0 ? (
              <p className="font-mono text-[10px] text-muted/50 italic text-center py-4">No recordings found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {recordings.map((rec) => (
                  <button 
                    key={rec.id}
                    onClick={() => handleAddMedia(rec)}
                    className="group relative aspect-video bg-bg rounded-xl border border-border overflow-hidden hover:border-accent transition-all text-left"
                  >
                    <video src={rec.video_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all p-2 flex flex-col justify-end">
                      <span className="font-syne font-bold text-[10px] text-white truncate">{rec.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <button 
              onClick={() => audioInputRef.current?.click()}
              className="w-full py-4 bg-bg border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors group"
            >
              <Upload size={20} className="text-muted group-hover:text-accent transition-colors" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted group-hover:text-text selection:bg-none">
                Upload Music (MP3/WAV)
              </span>
              <input 
                ref={audioInputRef}
                type="file" 
                accept="audio/*" 
                className="hidden" 
                onChange={handleAudioUpload}
              />
            </button>

            <div className="space-y-2 pt-2">
              <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Tracks</label>
              {compositionProps.audioTracks.length === 0 ? (
                <p className="font-mono text-[10px] text-muted/50 italic">No audio tracks added.</p>
              ) : (
                compositionProps.audioTracks.map((track) => (
                  <div key={track.id} className="flex items-center justify-between p-2 bg-bg rounded-lg border border-border">
                    <div className="flex items-center gap-2 truncate">
                      <Music size={12} className="text-accent shrink-0" />
                      <span className="font-mono text-[10px] truncate">Audio_{track.id.split('-')[1]}</span>
                    </div>
                    <button 
                      onClick={() => deleteAudioTrack(track.id)}
                      className="text-muted hover:text-red transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* OVERLAYS TAB */}
        {activeTab === 'overlays' && (
          <div className="grid grid-cols-2 gap-2">
            <PresetButton onClick={handleAddText} icon={<Type size={18} />} label="Text" />
            <PresetButton onClick={() => addOverlay({
              id: `shape-${nanoid(8)}`,
              type: 'shape',
              startFrame: playheadFrame,
              durationInFrames: fps * 3,
              props: { shapeType: 'rectangle', fillColour: 'transparent', strokeColour: '#E8FF47', strokeWidth: 3, opacity: 1, cornerRadius: 8, x: 0.25, y: 0.25, width: 0.5, height: 0.3 } as ShapeOverlayProps
            })} icon={<Square size={18} />} label="Shape" />
            <PresetButton onClick={() => addOverlay({
              id: `blur-${nanoid(8)}`,
              type: 'blur',
              startFrame: playheadFrame,
              durationInFrames: fps * 3,
              props: { blurRadius: 20, x: 0.3, y: 0.3, width: 0.4, height: 0.2 } as BlurOverlayProps
            })} icon={<Eye size={18} />} label="Blur" />
            <PresetButton onClick={() => addOverlay({
              id: `zoom-${nanoid(8)}`,
              type: 'zoom',
              startFrame: playheadFrame,
              durationInFrames: fps * 2,
              props: { zoomLevel: 200, centreX: 0.5, centreY: 0.5, easing: 'spring' } as ZoomOverlayProps
            })} icon={<ZoomIn size={18} />} label="Zoom" />
          </div>
        )}

        {/* EFFECTS TAB */}
        {activeTab === 'effects' && (
          <div className="space-y-2">
            <EffectItem 
              title="Black & White" 
              description="Classic monochrome look" 
              onClick={() => useEditorStore.getState().addEffect({
                id: `effect-${nanoid(8)}`,
                type: 'grayscale',
                startFrame: playheadFrame,
                durationInFrames: fps * 3,
                config: { intensity: 1 }
              })}
            />
            <EffectItem 
              title="Sepia" 
              description="Warm vintage tone" 
              onClick={() => useEditorStore.getState().addEffect({
                id: `effect-${nanoid(8)}`,
                type: 'sepia',
                startFrame: playheadFrame,
                durationInFrames: fps * 3,
                config: { intensity: 1 }
              })}
            />
            <EffectItem 
              title="Blur Focus" 
              description="Soft blur over time" 
              onClick={() => useEditorStore.getState().addEffect({
                id: `effect-${nanoid(8)}`,
                type: 'blur',
                startFrame: playheadFrame,
                durationInFrames: fps * 3,
                config: { radius: 10 }
              })}
            />
          </div>
        )}

      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <p className="font-mono text-[9px] text-muted text-center leading-relaxed">
          Select an element on the timeline to edit properties.
        </p>
      </div>
    </div>
  );
}

// --- Helpers ---
function PresetButton({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 bg-bg border border-border rounded-xl hover:border-accent transition-all group"
    >
      <div className="text-muted group-hover:text-accent transition-colors mb-2">{icon}</div>
      <span className="font-mono text-[9px] uppercase tracking-wider text-muted group-hover:text-text">{label}</span>
    </button>
  );
}

function EffectItem({ title, description, onClick }: { title: string, description: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-3 bg-bg border border-border rounded-xl hover:border-accent transition-all group"
    >
      <h4 className="font-syne font-bold text-[11px] group-hover:text-accent transition-colors">{title}</h4>
      <p className="font-mono text-[9px] text-muted mt-0.5">{description}</p>
    </button>
  );
}
