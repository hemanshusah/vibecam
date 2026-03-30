"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: "0%", color: "bg-border", label: "" };
    if (password.length < 6) return { width: "33%", color: "bg-red", label: "Weak" };
    if (password.length < 10) return { width: "66%", color: "bg-yellow-500", label: "Fair" };
    return { width: "100%", color: "bg-[#4ADE80]", label: "Strong" };
  };

  const strength = getPasswordStrength();

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-accent" />
            </div>
          </div>
          <h2 className="font-syne font-bold text-3xl">Check your email</h2>
          <p className="font-mono text-sm text-muted max-w-sm mx-auto">
            We&apos;ve sent a confirmation link to <span className="text-text font-bold">{email}</span>.
            Click the link to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
          >
            Go to Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="font-syne font-bold text-3xl mb-2">Create account</h2>
          <p className="font-mono text-sm text-muted mb-8">
            Sign up to share recordings and manage your library.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-dim border border-red/20 font-mono text-xs text-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="register-email" className="font-mono text-xs text-muted uppercase tracking-wider">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="font-mono text-xs text-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
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
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-muted">{strength.label}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="register-confirm" className="font-mono text-xs text-muted uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-bg border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:ring-1 transition-all ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red/50 focus:border-red/50 focus:ring-red/20"
                    : "border-border focus:border-accent/50 focus:ring-accent/20"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="font-mono text-[10px] text-red">Passwords don&apos;t match</p>
              )}
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
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-muted">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-accent hover:text-white transition-colors font-bold"
              >
                Sign in
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
