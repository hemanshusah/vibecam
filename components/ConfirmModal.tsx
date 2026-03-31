"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={isLoading ? undefined : onClose} 
      />
      
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Background Accent Gradient */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${isDestructive ? 'bg-red' : 'bg-accent'}`} />
        
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors disabled:opacity-0"
        >
          <X size={20} />
        </button>

        <div className={`w-14 h-14 rounded-2xl ${isDestructive ? 'bg-red/10 border-red/20' : 'bg-accent/10 border-accent/20'} border flex items-center justify-center mb-6`}>
          <AlertTriangle size={28} className={isDestructive ? 'text-red' : 'text-accent'} />
        </div>

        <h3 className="font-syne font-bold text-xl text-text mb-2">
          {title}
        </h3>
        <p className="font-mono text-xs text-muted leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-syne font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isDestructive 
                ? 'bg-red text-white hover:bg-red-light' 
                : 'bg-accent text-surface hover:bg-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : confirmText}
          </button>
          
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-mono text-xs font-bold text-muted hover:text-text hover:bg-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
