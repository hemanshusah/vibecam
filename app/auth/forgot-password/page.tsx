"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-accent" />
            </div>
          </div>
          <h2 className="font-syne font-bold text-3xl text-white">Email Sent</h2>
          <p className="font-mono text-sm text-muted max-w-sm mx-auto">
            We&apos;ve sent a password reset link to <span className="text-text font-bold">{email}</span>.
            Please check your inbox and follow the instructions.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-surface font-syne font-bold rounded-xl hover:bg-white transition-colors"
          >
            Back to Sign In <ArrowRight size={16} />
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
          <h2 className="font-syne font-bold text-3xl mb-2 text-white">Reset Password</h2>
          <p className="font-mono text-sm text-muted mb-8">
            Enter your email and we&apos;ll send you a link to get back into your account.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-dim border border-red/20 font-mono text-xs text-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="font-mono text-xs text-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 pl-11 bg-bg border border-border rounded-xl font-mono text-sm text-text placeholder:text-muted/50 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
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
                  Send Reset Link <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
