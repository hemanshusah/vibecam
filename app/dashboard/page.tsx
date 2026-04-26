"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { formatTime } from "@/lib/format";
import {
  Copy,
  Check,
  Trash2,
  Video,
  Loader2,
  ArrowRight,
  LayoutGrid,
  Download,
  Pencil,
  Heart,
  Scissors,
  ExternalLink,
  Play,
} from "lucide-react";
import Link from "next/link";
import { SupportModal } from "@/components/SupportModal";
import { ConfirmModal } from "@/components/ConfirmModal";

type VideoRecord = {
  id: string;
  title: string;
  video_url: string;
  duration: number;
  trim_start: number;
  trim_end: number;
  mime_type: string;
  has_mic: boolean;
  has_camera: boolean;
  created_at: string;
};

type RenderRecord = {
  id: string;
  user_id: string;
  recording_id: string;
  status: string;
  progress: number;
  output_url?: string;
  composition: Record<string, unknown>;
  created_at: string;
};

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [recordings, setRecordings] = useState<VideoRecord[]>([]);
  const [renders, setRenders] = useState<RenderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'renders' | 'selfie' | 'recording'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'renders' || tab === 'selfie' || tab === 'recording') {
        setFilterType(tab);
      }
    }
  }, []);

  const fetchRecordings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRecordings(data);
      }
    } catch (err) {
      console.error("Failed to fetch recordings:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchRenders = useCallback(async () => {
    try {
      // Fetch only matching user_id for security.
      const { data } = await supabase
      .from("renders")
      .select("*")
      .eq("user_id", user!.id) // CRITICAL: Only fetch the current user's renders
      .order("created_at", { ascending: false });
      
      if (data) setRenders(data);
    } catch (err) {
      console.error("Failed to fetch renders:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchRecordings();
    fetchRenders();

    const interval = setInterval(fetchRenders, 5000);
    return () => clearInterval(interval);
  }, [user, fetchRecordings, fetchRenders]);

  const handleDeleteRender = (id: string) => {
    setVideoToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleCopyLink = (id: string, type: 'recording' | 'render') => {
    const url = `${window.location.origin}/watch/${type}/${id}`;
    try {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = (id: string) => {
    setVideoToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    const id = videoToDelete;
    setConfirmDeleteOpen(false);
    try {
      // Try deleting from renders first, then videos
      const isRender = renders.some(r => r.id === id);
      const table = isRender ? 'renders' : 'videos';
      
      const { error } = await supabase.from(table).delete().eq("id", id);
      
      if (!error) {
        if (isRender) {
          setRenders((prev) => prev.filter((r) => r.id !== id));
        } else {
          setRecordings((prev) => prev.filter((r) => r.id !== id));
        }
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setVideoToDelete(null);
    }
  };

  const handleDownloadVideo = async (url: string, title: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.mp4`; // Changed to .mp4
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  const handleRename = async (id: string) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    try {
      const res = await fetch('/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: trimmed, type: 'video' }),
      });
      
      if (!res.ok) throw new Error('Failed to rename');
      
      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: trimmed } : r))
      );
    } catch (err) {
      console.error("Failed to rename:", err);
      alert("Failed to edit. Please check your connection and try again.");
    } finally {
      setEditingId(null);
    }
  };

  const handleRenameRender = async (id: string, currentComposition: Record<string, unknown>) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    try {
      const res = await fetch('/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: trimmed, type: 'render' }),
      });

      if (!res.ok) throw new Error('Failed to rename render');

      const updatedComposition = { ...currentComposition, title: trimmed };
      setRenders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, composition: updatedComposition } : r))
      );
    } catch (err) {
      console.error("Failed to rename render:", err);
      alert("Failed to edit. Please check your connection and try again.");
    } finally {
      setEditingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-accent animate-pulseSlow" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Video size={28} className="text-accent" />
        </div>
        <h2 className="font-syne font-bold text-3xl">Sign in to view your recordings</h2>
        <p className="font-mono text-sm text-muted max-w-sm">
          Create an account or sign in to access your recording library.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
        >
          Sign In <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Derived filtered data
  const filteredRecordings = recordings.filter(r => {
    if (filterType === 'all') return true;
    if (filterType === 'selfie') return r.mime_type === 'video';
    if (filterType === 'recording') return r.mime_type === 'recording';
    return false;
  });

  const showRenders = filterType === 'all' || filterType === 'renders';
  const showLibrary = filterType !== 'renders';

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-10 pt-4 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border group-hover:border-accent group-hover:scale-110 transition-all">
                <div className="w-3 h-3 bg-accent rounded-full animate-[pulseSlow_2s_infinite]" />
              </div>
              <h1 className="font-syne font-bold text-lg leading-none tracking-tight group-hover:text-accent transition-colors">
                VibeCam
              </h1>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-accent" />
              <span className="font-syne font-bold text-lg">My Library</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={() => setSupportModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] text-[#FF0000] border border-[#FF0000]/20 hover:bg-[#FF0000]/10 rounded-lg transition-all"
            >
              <Heart size={12} className="fill-[#FF0000]/20" /> Support Me
            </button>
            <button
              onClick={signOut}
              className="px-4 py-2 font-mono text-xs text-muted hover:text-red border border-transparent hover:border-border rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Navigation & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div className="flex flex-wrap bg-surface border border-border p-1 rounded-xl">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-4 py-1.5 rounded-lg font-syne font-bold text-[10px] transition-all uppercase tracking-widest ${filterType === 'all' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-muted hover:text-text'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('renders')}
                className={`px-4 py-1.5 rounded-lg font-syne font-bold text-[10px] transition-all uppercase tracking-widest ${filterType === 'renders' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-muted hover:text-text'}`}
              >
                Advanced Renders
              </button>
              <button 
                onClick={() => setFilterType('selfie')}
                className={`px-4 py-1.5 rounded-lg font-syne font-bold text-[10px] transition-all uppercase tracking-widest ${filterType === 'selfie' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-muted hover:text-text'}`}
              >
                Selfie Videos
              </button>
              <button 
                onClick={() => setFilterType('recording')}
                className={`px-4 py-1.5 rounded-lg font-syne font-bold text-[10px] transition-all uppercase tracking-widest ${filterType === 'recording' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-muted hover:text-text'}`}
              >
                Screen Records
              </button>
            </div>

           <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/20 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest">Active Workspace</span>
           </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-accent animate-spin" />
          </div>
        ) : (
          <div className="space-y-16">
             {/* 1. ADVANCED RENDERS */}
             {showRenders && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="font-syne font-bold text-xl flex items-center gap-2 uppercase tracking-tighter text-accent/80">
                        Production Exports
                     </h3>
                     <span className="font-mono text-[9px] text-muted tracking-[0.2em]">{renders.length} ITEMS</span>
                  </div>
                  {renders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renders.map((render) => (
                        <div key={render.id} className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent transition-all animate-fade-in shadow-sm hover:shadow-xl hover:shadow-accent/5">
                          <div className="aspect-video bg-black/40 relative">
                            {render.status === 'done' && render.output_url ? (
                              <Link href={`/watch/render/${render.id}`}>
                                <video src={render.output_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="p-3 bg-accent rounded-full text-surface shadow-xl shadow-accent/40 scale-90 group-hover:scale-100 transition-transform">
                                    <ExternalLink size={16} />
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-black/60">
                                <Loader2 className="animate-spin text-accent" size={24} />
                                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-accent transition-all duration-500 shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" 
                                    style={{ width: `${render.progress || 0}%` }} 
                                  />
                                </div>
                                <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">Rendering {Math.round(render.progress || 0)}%</span>
                              </div>
                            )}
                          </div>
                          <div className="p-6 space-y-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-grow min-w-0">
                                {editingId === render.id ? (
                                  <input
                                    autoFocus
                                    className="bg-bg border border-accent/30 rounded px-2 py-1 text-xs font-syne font-bold w-full focus:outline-none focus:ring-1 focus:ring-accent"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={() => handleRenameRender(render.id, render.composition)}
                                    onKeyDown={(e) => e.key === "Enter" && handleRenameRender(render.id, render.composition)}
                                  />
                                ) : (
                                  <h4 className="font-syne font-bold text-sm truncate group-hover:text-accent transition-colors">
                                    {(render.composition as Record<string, unknown>)['title'] as string || 'Untitled Edit'}
                                  </h4>
                                )}
                                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                    <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                                      {new Date(render.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="w-1 h-1 bg-muted rounded-full" />
                                    <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                                      {new Date(render.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-1 bg-bg/50 border border-border rounded-xl p-1">
                                <button 
                                  onClick={() => handleCopyLink(render.id, 'render')}
                                  className="p-2 text-muted hover:text-accent transition-colors relative"
                                  title="Copy Link"
                                >
                                  {copiedId === render.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingId(render.id);
                                    setEditTitle((render.composition as Record<string, unknown>)['title'] as string || 'Untitled Edit');
                                  }}
                                  className="p-2 text-muted hover:text-accent transition-colors"
                                  title="Rename"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRender(render.id)}
                                  className="p-2 text-muted hover:text-red transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2">
                               <Link 
                                  href={`/watch/render/${render.id}`}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent/10 border border-accent/20 text-accent font-syne font-bold text-[10px] rounded-xl hover:bg-accent hover:text-surface transition-all uppercase tracking-wider"
                               >
                                  <ExternalLink size={12} /> View Result
                               </Link>
                               <Link 
                                  href={`/edit/${render.recording_id}`}
                                  className="flex items-center justify-center p-2.5 bg-surface border border-border text-muted hover:bg-bg hover:text-accent transition-all rounded-xl"
                                  title="Edit Original"
                               >
                                  <Scissors size={14} />
                               </Link>
                               {render.output_url && (
                                 <button 
                                   onClick={() => handleDownloadVideo(render.output_url!, (render.composition as Record<string, unknown>)['title'] as string || 'Export')}
                                   className="flex items-center justify-center p-2.5 bg-surface border border-border text-muted hover:bg-bg hover:text-accent transition-all rounded-xl"
                                   title="Download Export"
                                 >
                                   <Download size={14} />
                                 </button>
                               )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filterType === 'renders' && (
                    <div className="px-6 py-12 border border-dashed border-border rounded-3xl text-center bg-surface/30">
                       <p className="font-mono text-xs text-muted italic">No polished exports found yet...</p>
                    </div>
                  )}
               </div>
             )}

             {/* 2. RECORDING LIBRARY */}
             {showLibrary && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="font-syne font-bold text-xl flex items-center gap-2 uppercase tracking-tighter text-text/80">
                        Recording Library
                     </h3>
                     <span className="font-mono text-[9px] text-muted tracking-[0.2em]">{filteredRecordings.length} ITEMS</span>
                  </div>
                  {filteredRecordings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRecordings.map((rec) => {
                        const trimmedDuration = Math.floor(rec.duration * (rec.trim_end - rec.trim_start));
                        const isSelfie = rec.mime_type === 'video';
                        const dateObj = new Date(rec.created_at);

                        return (
                          <div key={rec.id} className="group bg-surface border border-border rounded-3xl overflow-hidden hover:border-accent transition-all animate-fade-in relative shadow-sm hover:shadow-xl hover:shadow-accent/5">
                            {/* Item Preview */}
                            <div className="aspect-video bg-black/40 relative">
                               <video src={rec.video_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                               <div className="absolute top-3 left-3 flex gap-2">
                                  <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md font-mono text-[8px] text-white/70 uppercase font-bold">
                                    {isSelfie ? "Selfie" : "Screen"}
                                  </div>
                                  <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md font-mono text-[8px] text-white/70 uppercase">
                                    {formatTime(trimmedDuration)}
                                  </div>
                               </div>
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Link 
                                   href={`/watch/recording/${rec.id}`}
                                   className="p-4 bg-accent text-surface rounded-full shadow-2xl shadow-accent/50 hover:scale-110 active:scale-95 transition-all"
                                 >
                                   <Play className="fill-surface" size={20} />
                                 </Link>
                               </div>
                            </div>

                            <div className="p-6 space-y-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow min-w-0">
                                  {editingId === rec.id ? (
                                    <input
                                      autoFocus
                                      className="bg-bg border border-accent/30 rounded px-2 py-1 text-xs font-syne font-bold w-full focus:outline-none focus:ring-1 focus:ring-accent"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      onBlur={() => handleRename(rec.id)}
                                      onKeyDown={(e) => e.key === "Enter" && handleRename(rec.id)}
                                    />
                                  ) : (
                                    <h4 className="font-syne font-bold text-sm truncate group-hover:text-accent transition-colors">
                                      {rec.title}
                                    </h4>
                                  )}
                                  <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                      <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                                        {dateObj.toLocaleDateString()}
                                      </span>
                                      <span className="w-1 h-1 bg-muted rounded-full" />
                                      <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1 bg-bg/50 border border-border rounded-xl p-1">
                                  <button 
                                    onClick={() => handleCopyLink(rec.id, 'recording')}
                                    className="p-2 text-muted hover:text-accent transition-colors relative"
                                    title="Copy Link"
                                  >
                                    {copiedId === rec.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setEditingId(rec.id);
                                      setEditTitle(rec.title);
                                    }}
                                    className="p-2 text-muted hover:text-accent transition-colors"
                                    title="Rename"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(rec.id)}
                                    className="p-2 text-muted hover:text-red transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                 <Link 
                                    href={`/watch/recording/${rec.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent/10 border border-accent/20 text-accent font-syne font-bold text-[10px] rounded-xl hover:bg-accent hover:text-surface transition-all uppercase tracking-wider"
                                 >
                                    <ExternalLink size={12} /> View Result
                                 </Link>
                                 <Link 
                                    href={`/edit/${rec.id}`}
                                    className="flex items-center justify-center p-2.5 bg-surface border border-border text-muted hover:bg-bg hover:text-accent transition-all rounded-xl"
                                    title="Advanced Editor"
                                 >
                                    <Scissors size={14} />
                                 </Link>
                                 <button 
                                   onClick={() => handleDownloadVideo(rec.video_url, rec.title)}
                                   className="flex items-center justify-center p-2.5 bg-surface border border-border text-muted hover:bg-bg hover:text-accent transition-all rounded-xl"
                                   title="Download Original"
                                 >
                                   <Download size={14} />
                                 </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-6 py-20 border border-dashed border-border rounded-3xl text-center bg-surface/30">
                       <Video size={32} className="text-muted/20 mx-auto mb-4" />
                       <p className="font-mono text-xs text-muted max-w-xs mx-auto">Your library for this category is empty.</p>
                       <Link href="/" className="inline-flex items-center gap-2 mt-6 font-syne font-bold text-accent hover:text-white transition-colors group">
                          Start Recording <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}

        <div className="pt-24 pb-12 text-center font-mono text-xs text-muted">
          Built by{" "}
          <a
            href="https://linkedin.com/in/himanshusah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white transition-colors underline underline-offset-4"
          >
             Himanshu Sah - LinkedIn
          </a>
          ! 👋
        </div>
      </div>

      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
      
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => { setConfirmDeleteOpen(false); setVideoToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Recording"
        message="Are you sure you want to delete this recording? This action cannot be undone and it will be removed from your public share links."
        confirmText="Permanently Delete"
        cancelText="Keep Recording"
        isDestructive={true}
      />
    </div>
  );
}
