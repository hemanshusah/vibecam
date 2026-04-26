"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { 
  Users, 
  Video, 
  Database, 
  Shield, 
  Search, 
  MoreVertical, 
  ArrowUpRight,
  Loader2,
  AlertTriangle
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  videoCount: number;
  renderCount: number;
  estStorageMB: number;
}

interface Stats {
  totalUsers: number;
  totalVideos: number;
  totalRenders: number;
  totalEstStorageMB: number;
}

export default function AdminDashboard() {
  const { user, session, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStats(data.stats);
      setUsers(data.users);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== "admin") {
        router.push("/dashboard");
      } else {
        fetchData();
      }
    }
  }, [user, role, authLoading, router, fetchData]);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="bg-red-dim border border-red/20 rounded-2xl p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red mx-auto mb-4" />
          <h2 className="font-syne font-bold text-2xl text-white mb-2">Access Error</h2>
          <p className="font-mono text-sm text-muted mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent text-surface font-syne font-bold rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-32 pb-20 px-6">
      <Header />
      
      <main className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="inline-block py-1 px-3 rounded-md border border-accent/20 font-mono text-[10px] text-accent uppercase tracking-widest mb-4">
            System Administration
          </div>
          <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="font-mono text-xs text-muted">
            Managing VibeCam Platform & Usage Analytics
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-400" },
            { label: "Videos Produced", value: stats?.totalVideos, icon: Video, color: "text-accent" },
            { label: "Renders Exported", value: stats?.totalRenders, icon: ArrowUpRight, color: "text-purple-400" },
            { label: "Est. Storage", value: `${(stats?.totalEstStorageMB || 0) / 1024 > 1 ? ((stats?.totalEstStorageMB || 0)/1024).toFixed(2) + ' GB' : (stats?.totalEstStorageMB || 0) + ' MB'}`, icon: Database, color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-bg border border-border group-hover:border-accent/40 transition-colors`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="font-syne font-bold text-3xl text-white mb-1">
                {stat.value || 0}
              </div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* User Table Section */}
        <section className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="font-syne font-bold text-2xl text-white">User Directory</h2>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">Manage accounts and roles</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-12 py-3 font-mono text-xs text-text outline-none focus:border-accent/50 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-bg/50 border-b border-border">
                <tr>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold">User</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold">Role</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold">Joined</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-center">Videos</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-center">Renders</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">Est. Storage</th>
                  <th className="px-8 py-4 text-[10px] text-muted uppercase tracking-widest font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase">
                          {u.email[0]}
                        </div>
                        <span className="text-sm text-text font-bold truncate max-w-[200px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-accent-dim text-accent border border-accent/20' : 'bg-bg text-muted border border-border'
                      }`}>
                        {u.role === 'admin' && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-dim">
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm text-text font-bold">{u.videoCount}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm text-text font-bold">{u.renderCount}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-xs text-text">
                      {u.estStorageMB} MB
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-muted hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-bg/30 border-t border-border flex justify-center">
            <p className="font-mono text-[9px] text-dim uppercase tracking-[.2em]">
              All data current as of {new Date().toLocaleTimeString()}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
