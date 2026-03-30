"use client";

import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/context/AuthProvider';
import { User, LogOut, LayoutGrid, Heart } from 'lucide-react';
import Link from 'next/link';
import { SupportModal } from './SupportModal';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const status = useAppStore((state) => state.status);
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 p-6 flex flex-wrap gap-4 justify-between items-center z-50 pointer-events-none">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border">
          <div className="w-3 h-3 bg-accent rounded-full animate-[pulseSlow_2s_infinite]" />
        </div>
        <div>
          <h1 className="font-syne font-bold text-lg leading-none tracking-tight">VibeCam</h1>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mt-0.5">
            {user ? 'your recordings' : 'no login · no friction'}
          </p>
        </div>
      </Link>

      {/* Right: Auth + Status */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => setSupportModalOpen(true)}
          className="group flex items-center gap-2 px-5 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-full font-syne font-bold text-sm text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]"
        >
          <Heart size={16} className="fill-[#FF0000]/20 group-hover:fill-white transition-colors" /> Support Me
        </button>

        {status === 'recording' && (
          <div className="px-3 py-1.5 rounded-full bg-surface border border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red animate-[blink_1s_infinite]" />
            <span className="font-mono text-xs text-text">REC</span>
          </div>
        )}

        {!loading && (
          <>
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-accent text-surface font-syne font-bold text-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg shadow-accent/20"
                >
                  {initial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-mono text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-mono text-sm text-text hover:bg-bg transition-colors"
                      >
                        <LayoutGrid size={14} className="text-accent" /> My Recordings
                      </Link>
                      <button
                        onClick={() => { signOut(); setMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 font-mono text-sm text-muted hover:text-red hover:bg-bg transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full font-mono text-xs text-text hover:border-accent/30 hover:text-accent transition-all"
              >
                <User size={14} /> Sign In
              </Link>
            )}
          </>
        )}
      </div>

      </header>
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </>
  );
}

