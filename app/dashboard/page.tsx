"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { formatTime } from "@/lib/format";
import {
  Copy,
  Check,
  Trash2,
  Video,
  Calendar,
  Clock,
  Mic,
  Camera,
  Loader2,
  ArrowRight,
  LayoutGrid,
  Download,
  Pencil,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { SupportModal } from "@/components/SupportModal";

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

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [recordings, setRecordings] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchRecordings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRecordings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecordings(data);
    }
    setLoading(false);
  };

  const handleCopyLink = async (id: string) => {
    const url = `${window.location.origin}/#watch:${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recording permanently?")) return;
    setDeletingId(id);

    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (!error) {
        setRecordings((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadVideo = async (url: string, title: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.webm`;
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
      await supabase.from("videos").update({ title: trimmed }).eq("id", id);
      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: trimmed } : r))
      );
    } catch (err) {
      console.error("Failed to rename:", err);
    } finally {
      setEditingId(null);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-accent animate-pulseSlow" />
      </div>
    );
  }

  // Not logged in — redirect to login
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

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-10 pt-4 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border">
                <div className="w-3 h-3 bg-accent rounded-full animate-[pulseSlow_2s_infinite]" />
              </div>
              <h1 className="font-syne font-bold text-lg leading-none tracking-tight group-hover:text-accent transition-colors">
                VibeCam
              </h1>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-accent" />
              <span className="font-syne font-bold text-lg">My Recordings</span>
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

        {/* Stats Bar */}
        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl">
            <Video size={14} className="text-accent" />
            <span className="font-mono text-sm text-text">
              {recordings.length} recording{recordings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-accent animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && recordings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center">
              <Video size={32} className="text-muted" />
            </div>
            <div className="space-y-2">
              <h3 className="font-syne font-bold text-2xl">No recordings yet</h3>
              <p className="font-mono text-sm text-muted max-w-sm">
                Start recording your screen and upload to see them here.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
            >
              Start Recording <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Recordings Grid */}
        {!loading && recordings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordings.map((rec) => {
              const trimmedDuration = Math.floor(
                rec.duration * (rec.trim_end - rec.trim_start)
              );
              const dateObj = new Date(rec.created_at);

              return (
                <div
                  key={rec.id}
                  className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-light transition-all duration-200"
                >
                  {/* Video Preview */}
                  <div className="relative aspect-video bg-black">
                    <video
                      src={rec.video_url}
                      className="w-full h-full object-contain"
                      preload="metadata"
                      muted
                      onMouseEnter={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.currentTime = rec.trim_start * rec.duration;
                        video.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = rec.trim_start * rec.duration;
                      }}
                    />
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md font-mono text-[10px] text-white">
                      {formatTime(trimmedDuration)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    {editingId === rec.id ? (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleRename(rec.id); }}
                        className="flex gap-1.5"
                      >
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleRename(rec.id)}
                          className="flex-1 px-2 py-1 bg-bg border border-accent/30 rounded-lg font-syne font-bold text-sm text-text outline-none focus:ring-1 focus:ring-accent/20"
                        />
                      </form>
                    ) : (
                      <h4
                        onClick={() => { setEditingId(rec.id); setEditTitle(rec.title); }}
                        className="font-syne font-bold text-sm truncate cursor-pointer group/title flex items-center gap-1.5 hover:text-accent transition-colors"
                        title="Click to rename"
                      >
                        {rec.title}
                        <Pencil size={10} className="text-muted opacity-0 group-hover/title:opacity-100 transition-opacity" />
                      </h4>
                    )}

                    <div className="flex flex-wrap gap-3 font-mono text-[10px] text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {dateObj.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {dateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {rec.has_mic && (
                        <span className="flex items-center gap-1 text-accent">
                          <Mic size={10} /> Mic
                        </span>
                      )}
                      {rec.has_camera && (
                        <span className="flex items-center gap-1 text-accent">
                          <Camera size={10} /> Cam
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleCopyLink(rec.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                          copiedId === rec.id
                            ? "bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20"
                            : "bg-bg border border-border text-muted hover:text-text hover:border-border-light"
                        }`}
                      >
                        {copiedId === rec.id ? (
                          <>
                            <Check size={12} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadVideo(rec.video_url, rec.title)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs bg-bg border border-border text-muted hover:text-accent hover:border-accent/20 transition-all"
                        title="Download"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        disabled={deletingId === rec.id}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs bg-bg border border-border text-muted hover:text-red hover:border-red/20 transition-all disabled:opacity-50"
                      >
                        {deletingId === rec.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Attribution */}
        <div className="pt-12 pb-6 text-center font-mono text-xs text-muted">
          Built by{" "}
          <a
            href="https://linkedin.com/in/himanshusah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white transition-colors"
          >
            Himanshu Sah - LinkedIn
          </a>
          ! 👋
        </div>
      </div>
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
}
