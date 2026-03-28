"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { IdleScreen } from '@/components/IdleScreen';
import { RecordingScreen } from '@/components/RecordingScreen';
import { EditorScreen } from '@/components/EditorScreen';
import { WatchScreen } from '@/components/WatchScreen';
import { CameraBubble } from '@/components/CameraBubble';

export default function Home() {
  const { status, setStatus } = useAppStore();
  const [watchId, setWatchId] = useState<string | null>(null);

  // Hash-based routing for Watch screen
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#watch:')) {
        const id = hash.replace('#watch:', '');
        setWatchId(id);
        setStatus('watching');
      } else if (status === 'watching') {
        setStatus('idle');
        setWatchId(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setStatus, status]);

  return (
    <main className="min-h-screen bg-bg selection:bg-accent selection:text-surface">
      <Header />
      <CameraBubble />
      
      {status === 'idle' && <IdleScreen />}
      {status === 'recording' && <RecordingScreen />}
      {status === 'editing' && <EditorScreen />}
      {status === 'watching' && watchId && <WatchScreen id={watchId} />}
    </main>
  );
}
