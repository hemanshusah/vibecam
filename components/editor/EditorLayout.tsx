"use client";

// ============================================
// VibeCam V2 — Editor 3-Panel Grid Layout
// ============================================

import { ReactNode } from 'react';

type EditorLayoutProps = {
  toolbar: ReactNode;
  sidebar: ReactNode;
  sidebarPanel: ReactNode;
  preview: ReactNode;
  properties: ReactNode;
  timeline: ReactNode;
  isSidebarOpen: boolean;
};

/**
 * CSS Grid layout filling the full viewport.
 * Left: Sidebar Icons (64px) | Sidebar Panel (280px, optional)
 * Middle: Preview
 * Right: Properties (340px)
 * Bottom: Timeline (300px)
 */
export function EditorLayout({
  toolbar,
  sidebar,
  sidebarPanel,
  preview,
  properties,
  timeline,
  isSidebarOpen,
}: EditorLayoutProps) {
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-bg text-text"
      style={{
        display: 'grid',
        gridTemplateRows: '48px 1fr 300px',
        gridTemplateColumns: `64px ${isSidebarOpen ? '280px' : '0px'} 1fr 340px`,
        gridTemplateAreas: `
          "toolbar toolbar toolbar toolbar"
          "sidebar panel preview properties"
          "timeline timeline timeline timeline"
        `,
        transition: 'grid-template-columns 0.2s ease-in-out',
      }}
    >
      {/* Toolbar */}
      <div
        style={{ gridArea: 'toolbar' }}
        className="border-b border-border bg-surface flex items-center px-4 gap-2 z-50"
      >
        {toolbar}
      </div>

      {/* Sidebar Icons */}
      <div
        style={{ gridArea: 'sidebar' }}
        className="border-r border-border bg-surface flex flex-col items-center py-4 gap-4 z-40"
      >
        {sidebar}
      </div>

      {/* Sidebar Panel */}
      <div
        style={{ gridArea: 'panel', display: isSidebarOpen ? 'block' : 'none' }}
        className="border-r border-border bg-surface/50 overflow-y-auto z-30"
      >
        {sidebarPanel}
      </div>

      {/* Preview Panel */}
      <div
        style={{ gridArea: 'preview' }}
        className="overflow-hidden flex items-center justify-center bg-black relative"
      >
        {preview}
      </div>

      {/* Properties Panel */}
      <div
        style={{ gridArea: 'properties' }}
        className="border-l border-border bg-surface overflow-y-auto z-40"
      >
        {properties}
      </div>

      {/* Timeline Panel */}
      <div
        style={{ gridArea: 'timeline' }}
        className="border-t border-border bg-bg overflow-hidden z-20"
      >
        {timeline}
      </div>
    </div>
  );
}
