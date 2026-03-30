"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      // Redirect to home after login
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border">
            <div className="w-3 h-3 bg-accent rounded-full animate-[pulseSlow_2s_infinite]" />
          </div>
          <div>
            <h1 className="font-syne font-bold text-lg leading-none tracking-tight">VibeCam</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-syne font-bold text-3xl mb-2">Welcome back</h2>
          <p className="font-mono text-sm text-muted mb-8">
            Sign in to share recordings and view your library.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-dim border border-red/20 font-mono text-xs text-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="font-mono text-xs text-muted uppercase tracking-wider">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="font-mono text-xs text-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-surface font-syne font-bold text-base rounded-xl hover:bg-white transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-accent hover:text-white transition-colors font-bold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            ← Back to VibeCam
          </Link>
        </div>
      </div>
    </div>
  );
}
