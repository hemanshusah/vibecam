"use client";

// ============================================
// VibeCam V2 — Editor Sidebar Icons
// ============================================

import { useEditorStore } from '@/store/useEditorStore';
import { 
  Music, 
  Type, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Monitor
} from 'lucide-react';

export function EditorSidebar() {
  const activeTab = useEditorStore((s) => s.activeSidebarTab);
  const setActiveTab = useEditorStore((s) => s.setActiveSidebarTab);
  const isSidebarOpen = useEditorStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useEditorStore((s) => s.setSidebarOpen);

  const tabs = [
    { id: 'media', icon: <Monitor size={20} />, label: 'Video' },
    { id: 'audio', icon: <Music size={20} />, label: 'Audio' },
    { id: 'overlays', icon: <Type size={20} />, label: 'Overlays' },
    { id: 'effects', icon: <Sparkles size={20} />, label: 'Effects' },
  ];

  return (
    <div className="flex flex-col items-center h-full gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            if (activeTab === tab.id && isSidebarOpen) {
              setSidebarOpen(false);
            } else {
              setActiveTab(tab.id as 'media' | 'audio' | 'overlays' | 'effects');
              setSidebarOpen(true);
            }
          }}
          className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === tab.id && isSidebarOpen
              ? 'bg-accent text-surface shadow-lg shadow-accent/20'
              : 'text-muted hover:bg-bg hover:text-text'
          }`}
          title={tab.label}
        >
          {tab.icon}
          <span className="font-mono text-[8px] mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
            {tab.label}
          </span>
          
          {/* Active Indicator */}
          {activeTab === tab.id && isSidebarOpen && (
            <div className="absolute left-full ml-3 w-1.5 h-1.5 bg-accent rounded-full" />
          )}
        </button>
      ))}

      <div className="mt-auto pb-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-muted hover:text-text hover:bg-bg transition-all"
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
