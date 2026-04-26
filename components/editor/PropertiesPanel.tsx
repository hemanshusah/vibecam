"use client";

// ============================================
// VibeCam V2 — Properties Panel (Right Sidebar)
// ============================================

import { useEditorStore } from '@/store/useEditorStore';
import type { TextOverlayProps, ZoomOverlayProps, BlurOverlayProps, ShapeOverlayProps, Overlay, VideoClip } from '@/lib/remotion-types';
import { Settings, Film, Type, ZoomIn, Eye, Square } from 'lucide-react';

export function PropertiesPanel() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);
  const compositionProps = useEditorStore((s) => s.compositionProps);
  const updateClip = useEditorStore((s) => s.updateClip);
  const updateOverlay = useEditorStore((s) => s.updateOverlay);
  const setFps = useEditorStore((s) => s.setFps);
  const setResolution = useEditorStore((s) => s.setResolution);

  const selectedClip = selectedClipId
    ? compositionProps.clips.find((c) => c.id === selectedClipId)
    : null;

  const selectedOverlay = selectedOverlayId
    ? compositionProps.overlays.find((o) => o.id === selectedOverlayId)
    : null;

  // Composition settings (nothing selected)
  if (!selectedClip && !selectedOverlay) {
    return (
      <div className="p-4 space-y-5">
        <PanelHeader icon={<Settings size={14} />} title="Composition" />

        <PropGroup label="Resolution">
          <select
            value={`${compositionProps.width}x${compositionProps.height}`}
            onChange={(e) => {
              const [w, h] = e.target.value.split('x').map(Number);
              setResolution(w, h);
            }}
            className="prop-select"
          >
            <option value="1920x1080">1920×1080 (1080p)</option>
            <option value="1280x720">1280×720 (720p)</option>
            <option value="854x480">854×480 (480p)</option>
            <option value="3840x2160">3840×2160 (4K)</option>
          </select>
        </PropGroup>

        <PropGroup label="Frame Rate">
          <select
            value={compositionProps.fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className="prop-select"
          >
            <option value={24}>24 fps</option>
            <option value={30}>30 fps</option>
            <option value={60}>60 fps</option>
          </select>
        </PropGroup>

        <PropGroup label="Clips">
          <span className="prop-value">{compositionProps.clips.length}</span>
        </PropGroup>
        <PropGroup label="Overlays">
          <span className="prop-value">{compositionProps.overlays.length}</span>
        </PropGroup>
        <PropGroup label="Effects">
          <span className="prop-value">{compositionProps.effects.length}</span>
        </PropGroup>
      </div>
    );
  }

  // Video clip selected
  if (selectedClip) {
    return (
      <VideoClipProperties clip={selectedClip} onUpdate={(u) => updateClip(selectedClip.id, u)} />
    );
  }

  // Overlay selected
  if (selectedOverlay) {
    return (
      <OverlayProperties overlay={selectedOverlay} onUpdate={(u) => updateOverlay(selectedOverlay.id, u)} />
    );
  }

  return null;
}

// --- Video Clip Properties ---
function VideoClipProperties({ clip, onUpdate }: { clip: VideoClip; onUpdate: (u: Partial<VideoClip>) => void }) {
  return (
    <div className="p-4 space-y-5">
      <PanelHeader icon={<Film size={14} />} title="Video Clip" />

      <PropGroup label="Speed">
        <select
          value={clip.speed}
          onChange={(e) => onUpdate({ speed: Number(e.target.value) })}
          className="prop-select"
        >
          <option value={0.25}>0.25x</option>
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x (Normal)</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
        </select>
      </PropGroup>

      <PropGroup label="Volume">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={clip.volume}
            onChange={(e) => onUpdate({ volume: Number(e.target.value) })}
            className="prop-range flex-grow"
          />
          <span className="prop-value w-10 text-right">{Math.round(clip.volume * 100)}%</span>
        </div>
      </PropGroup>

      <PropGroup label="Start Frame">
        <span className="prop-value">{clip.startFrame}</span>
      </PropGroup>
      <PropGroup label="Duration">
        <span className="prop-value">{clip.durationInFrames} frames</span>
      </PropGroup>
    </div>
  );
}

// --- Overlay Properties ---
function OverlayProperties({ overlay, onUpdate }: { overlay: Overlay; onUpdate: (u: Partial<Overlay>) => void }) {
  const props = overlay.props;

  if (overlay.type === 'text') {
    const tp = props as TextOverlayProps;
    return (
      <div className="p-4 space-y-5">
        <PanelHeader icon={<Type size={14} />} title="Text Overlay" />

        <PropGroup label="Text">
          <input
            type="text"
            value={tp.text}
            onChange={(e) =>
              onUpdate({ props: { ...tp, text: e.target.value } })
            }
            className="prop-input"
          />
        </PropGroup>

        <PropGroup label="Font">
          <select
            value={tp.fontFamily}
            onChange={(e) =>
              onUpdate({ props: { ...tp, fontFamily: e.target.value as TextOverlayProps['fontFamily'] } })
            }
            className="prop-select"
          >
            <option value="Syne">Syne</option>
            <option value="Geist Mono">Geist Mono</option>
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
          </select>
        </PropGroup>

        <PropGroup label="Size">
          <input
            type="number"
            value={tp.fontSize}
            onChange={(e) =>
              onUpdate({ props: { ...tp, fontSize: Number(e.target.value) } })
            }
            className="prop-input w-20"
            min={8}
            max={200}
          />
        </PropGroup>

        <PropGroup label="Weight">
          <select
            value={tp.fontWeight}
            onChange={(e) =>
              onUpdate({ props: { ...tp, fontWeight: e.target.value as 'regular' | 'bold' } })
            }
            className="prop-select"
          >
            <option value="regular">Regular</option>
            <option value="bold">Bold</option>
          </select>
        </PropGroup>

        <PropGroup label="Colour">
          <input
            type="color"
            value={tp.colour}
            onChange={(e) =>
              onUpdate({ props: { ...tp, colour: e.target.value } })
            }
            className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
          />
        </PropGroup>

        <PropGroup label="Alignment">
          <select
            value={tp.alignment}
            onChange={(e) =>
              onUpdate({ props: { ...tp, alignment: e.target.value as 'left' | 'center' | 'right' } })
            }
            className="prop-select"
          >
            <option value="left">Left</option>
            <option value="center">Centre</option>
            <option value="right">Right</option>
          </select>
        </PropGroup>

        <PropGroup label="Entrance">
          <select
            value={tp.entranceAnimation}
            onChange={(e) =>
              onUpdate({ props: { ...tp, entranceAnimation: e.target.value as TextOverlayProps['entranceAnimation'] } })
            }
            className="prop-select"
          >
            <option value="none">None</option>
            <option value="fadeIn">Fade In</option>
            <option value="slideUp">Slide Up</option>
            <option value="slideLeft">Slide Left</option>
            <option value="scaleIn">Scale In</option>
          </select>
        </PropGroup>

        <PropGroup label="Exit">
          <select
            value={tp.exitAnimation}
            onChange={(e) =>
              onUpdate({ props: { ...tp, exitAnimation: e.target.value as TextOverlayProps['exitAnimation'] } })
            }
            className="prop-select"
          >
            <option value="none">None</option>
            <option value="fadeOut">Fade Out</option>
            <option value="slideDown">Slide Down</option>
            <option value="scaleOut">Scale Out</option>
          </select>
        </PropGroup>
      </div>
    );
  }

  if (overlay.type === 'zoom') {
    const zp = props as ZoomOverlayProps;
    return (
      <div className="p-4 space-y-5">
        <PanelHeader icon={<ZoomIn size={14} />} title="Zoom Effect" />

        <PropGroup label="Zoom Level">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={zp.zoomLevel}
              onChange={(e) =>
                onUpdate({ props: { ...zp, zoomLevel: Number(e.target.value) } })
              }
              className="prop-range flex-grow"
            />
            <span className="prop-value w-12 text-right">{zp.zoomLevel}%</span>
          </div>
        </PropGroup>

        <PropGroup label="Centre X">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={zp.centreX}
            onChange={(e) =>
              onUpdate({ props: { ...zp, centreX: Number(e.target.value) } })
            }
            className="prop-range"
          />
        </PropGroup>

        <PropGroup label="Centre Y">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={zp.centreY}
            onChange={(e) =>
              onUpdate({ props: { ...zp, centreY: Number(e.target.value) } })
            }
            className="prop-range"
          />
        </PropGroup>

        <PropGroup label="Easing">
          <select
            value={zp.easing}
            onChange={(e) =>
              onUpdate({ props: { ...zp, easing: e.target.value as ZoomOverlayProps['easing'] } })
            }
            className="prop-select"
          >
            <option value="linear">Linear</option>
            <option value="ease-in-out">Ease In/Out</option>
            <option value="spring">Spring</option>
          </select>
        </PropGroup>
      </div>
    );
  }

  if (overlay.type === 'blur') {
    const bp = props as BlurOverlayProps;
    return (
      <div className="p-4 space-y-5">
        <PanelHeader icon={<Eye size={14} />} title="Blur / Redaction" />

        <PropGroup label="Blur Radius">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={4}
              max={40}
              step={1}
              value={bp.blurRadius}
              onChange={(e) =>
                onUpdate({ props: { ...bp, blurRadius: Number(e.target.value) } })
              }
              className="prop-range flex-grow"
            />
            <span className="prop-value w-8 text-right">{bp.blurRadius}</span>
          </div>
        </PropGroup>

        <PropGroup label="Position X">
          <input type="range" min={0} max={1} step={0.01} value={bp.x}
            onChange={(e) => onUpdate({ props: { ...bp, x: Number(e.target.value) } })}
            className="prop-range" />
        </PropGroup>
        <PropGroup label="Position Y">
          <input type="range" min={0} max={1} step={0.01} value={bp.y}
            onChange={(e) => onUpdate({ props: { ...bp, y: Number(e.target.value) } })}
            className="prop-range" />
        </PropGroup>
        <PropGroup label="Width">
          <input type="range" min={0.05} max={1} step={0.01} value={bp.width}
            onChange={(e) => onUpdate({ props: { ...bp, width: Number(e.target.value) } })}
            className="prop-range" />
        </PropGroup>
        <PropGroup label="Height">
          <input type="range" min={0.05} max={1} step={0.01} value={bp.height}
            onChange={(e) => onUpdate({ props: { ...bp, height: Number(e.target.value) } })}
            className="prop-range" />
        </PropGroup>
      </div>
    );
  }

  if (overlay.type === 'shape') {
    const sp = props as ShapeOverlayProps;
    return (
      <div className="p-4 space-y-5">
        <PanelHeader icon={<Square size={14} />} title="Shape Overlay" />

        <PropGroup label="Shape">
          <select
            value={sp.shapeType}
            onChange={(e) =>
              onUpdate({ props: { ...sp, shapeType: e.target.value as ShapeOverlayProps['shapeType'] } })
            }
            className="prop-select"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="line">Line</option>
            <option value="arrow">Arrow</option>
          </select>
        </PropGroup>

        <PropGroup label="Fill">
          <input type="color" value={sp.fillColour} onChange={(e) => onUpdate({ props: { ...sp, fillColour: e.target.value } })}
            className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
        </PropGroup>

        <PropGroup label="Stroke">
          <input type="color" value={sp.strokeColour} onChange={(e) => onUpdate({ props: { ...sp, strokeColour: e.target.value } })}
            className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
        </PropGroup>

        <PropGroup label="Stroke Width">
          <input type="range" min={1} max={10} value={sp.strokeWidth}
            onChange={(e) => onUpdate({ props: { ...sp, strokeWidth: Number(e.target.value) } })}
            className="prop-range" />
        </PropGroup>

        <PropGroup label="Opacity">
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={1} step={0.05} value={sp.opacity}
              onChange={(e) => onUpdate({ props: { ...sp, opacity: Number(e.target.value) } })}
              className="prop-range flex-grow" />
            <span className="prop-value w-10 text-right">{Math.round(sp.opacity * 100)}%</span>
          </div>
        </PropGroup>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PanelHeader icon={<Settings size={14} />} title="Properties" />
      <p className="font-mono text-xs text-muted mt-4">Select an element to edit its properties.</p>
    </div>
  );
}

// --- Shared UI components ---
function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-border">
      <span className="text-accent">{icon}</span>
      <h3 className="font-syne font-bold text-sm text-text">{title}</h3>
    </div>
  );
}

function PropGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] text-muted uppercase tracking-wider">{label}</label>
      <div>{children}</div>
    </div>
  );
}
