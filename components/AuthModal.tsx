"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, X } from "lucide-react";

type AuthModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
      setEmailSent(true);
      setLoading(false);
    }
  };

  // Password strength
  const getStrength = () => {
    if (password.length === 0) return { width: "0%", color: "bg-border", label: "" };
    if (password.length < 6) return { width: "33%", color: "bg-red", label: "Weak" };
    if (password.length < 10) return { width: "66%", color: "bg-yellow-500", label: "Fair" };
    return { width: "100%", color: "bg-[#4ADE80]", label: "Strong" };
  };
  const strength = getStrength();

  // Email confirmation sent
  if (emailSent) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl text-center space-y-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <CheckCircle size={28} className="text-accent" />
            </div>
          </div>
          <h3 className="font-syne font-bold text-2xl">Check your email</h3>
          <p className="font-mono text-xs text-muted">
            We&apos;ve sent a confirmation link to <span className="text-text font-bold">{email}</span>.
            Confirm your email, then sign in below.
          </p>
          <button
            onClick={() => { setEmailSent(false); switchMode("login"); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
          >
            Sign In <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text transition-colors">
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-bg rounded-xl border border-border">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              mode === "login" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-text"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              mode === "register" ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-text"
            }`}
          >
            Create Account
          </button>
        </div>

        <h3 className="font-syne font-bold text-2xl mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h3>
        <p className="font-mono text-xs text-muted mb-6">
          {mode === "login"
            ? "Sign in to upload & share your recording."
            : "Sign up to upload & share your recording."}
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-dim border border-red/20 font-mono text-xs text-red">
            {error}
          </div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min 6 characters" : "••••••••"}
                className="w-full px-4 py-2.5 pr-11 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === "register" && password.length > 0 && (
              <div className="space-y-0.5">
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

          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-muted uppercase tracking-wider">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 bg-bg border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:ring-1 transition-all ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red/50 focus:border-red/50 focus:ring-red/20"
                    : "border-border focus:border-accent/50 focus:ring-accent/20"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="font-mono text-[10px] text-red">Passwords don&apos;t match</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold text-sm rounded-xl hover:bg-white transition-colors shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
