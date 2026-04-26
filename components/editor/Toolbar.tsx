"use client";

import { useEditorStore } from '@/store/useEditorStore';
import { useRouter } from 'next/navigation';
import {
  Undo2,
  Redo2,
  Scissors,
  Trash2,
  Gauge,
  ArrowLeft,
} from 'lucide-react';

type ToolbarProps = {
  onExport: () => void;
};

export function Toolbar({ onExport }: ToolbarProps) {
  const router = useRouter();
  const recordingTitle = useEditorStore((s) => s.recordingTitle);
  const setRecordingTitle = useEditorStore((s) => s.setRecordingTitle);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const playheadFrame = useEditorStore((s) => s.playheadFrame);

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.canUndo);
  const canRedo = useEditorStore((s) => s.canRedo);
  const splitClip = useEditorStore((s) => s.splitClip);
  const deleteClip = useEditorStore((s) => s.deleteClip);
  const deleteOverlay = useEditorStore((s) => s.deleteOverlay);
  const selectedOverlayId = useEditorStore((s) => s.selectedOverlayId);

  const handleSplit = () => {
    if (selectedClipId) {
      splitClip(selectedClipId, playheadFrame);
    }
  };

  const handleDelete = () => {
    if (selectedClipId) deleteClip(selectedClipId);
    else if (selectedOverlayId) deleteOverlay(selectedOverlayId);
  };


  return (
    <div className="flex items-center justify-between w-full gap-2">
      {/* Left: Back + Undo/Redo + Clip tools */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-muted hover:text-text font-mono text-xs transition-colors rounded-lg hover:bg-bg"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="h-5 w-px bg-border mx-1" />

        <ToolButton onClick={undo} disabled={!canUndo()} title="Undo (⌘Z)" icon={<Undo2 size={14} />} />
        <ToolButton onClick={redo} disabled={!canRedo()} title="Redo (⌘⇧Z)" icon={<Redo2 size={14} />} />

        <div className="h-5 w-px bg-border mx-1" />

        <ToolButton onClick={handleSplit} disabled={!selectedClipId} title="Split (S)" icon={<Scissors size={14} />} />
        <ToolButton onClick={handleDelete} disabled={!selectedClipId && !selectedOverlayId} title="Delete (⌫)" icon={<Trash2 size={14} />} />

        <div className="h-5 w-px bg-border mx-1" />

        <ToolButton onClick={() => {}} title="Speed" icon={<Gauge size={14} />} />
      </div>

      {/* Centre: Recording title (editable) */}
      <input
        type="text"
        value={recordingTitle}
        onChange={(e) => setRecordingTitle(e.target.value)}
        className="font-syne font-bold text-sm text-center bg-transparent border-none outline-none text-text focus:text-accent transition-colors max-w-[240px] truncate"
        title="Click to rename"
      />

      {/* Right: Export */}
      <div className="flex items-center gap-1">
        <div className="h-5 w-px bg-border mx-1" />

        <button
          onClick={onExport}
          className="px-4 py-1.5 bg-accent text-surface font-syne font-bold text-xs rounded-lg hover:bg-white transition-colors shadow-sm shadow-accent/20"
        >
          Export
        </button>
      </div>
    </div>
  );
}

// --- ToolButton ---
function ToolButton({
  onClick,
  icon,
  title,
  label,
  disabled = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-muted transition-colors ${
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-bg hover:text-text'
      }`}
    >
      {icon}
      {label && <span className="font-mono text-[10px] hidden md:inline">{label}</span>}
    </button>
  );
}
