"use client";

import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Footer() {
  const { setSupportModalOpen } = useAppStore();

  return (
    <footer className="w-full border-t border-border bg-bg/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Copyright */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full" />
              </div>
              <span className="font-syne font-bold text-lg tracking-tight">VibeCam</span>
            </Link>
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider leading-relaxed max-w-xs">
              No login · no friction. Browser-native screen recorder.
              <br />
              &copy; 2025 VibeCam. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-syne font-semibold text-sm text-text">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h4 className="font-syne font-semibold text-sm text-text">Support</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setSupportModalOpen(true)}
                  className="flex items-center gap-2 group font-mono text-xs text-muted hover:text-[#FF4545] transition-colors"
                >
                  <Heart size={14} className="fill-[#FF4545]/10 group-hover:fill-[#FF4545]/20 group-hover:scale-110 transition-all" />
                  Support Me
                </button>
              </li>
              <li>
                <a
                  href="mailto:connect@dazuservices.com"
                  className="flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  <Mail size={14} />
                  connect@dazuservices.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
