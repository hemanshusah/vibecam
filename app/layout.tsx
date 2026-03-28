import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-syne"
});

const geistMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: "VibeCam",
  description: "No login · no friction. Browser-native screen recorder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${geistMono.variable} font-sans antialiased bg-noise`}>
        {children}
        <footer className="w-full py-8 text-center font-mono text-xs text-muted">
          Built by{' '}
          <a 
            href="https://linkedin.com/in/himanshusah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-white transition-colors"
          >
            Himanshu Sah - LinkedIn
          </a>
        </footer>
      </body>
    </html>
  );
}
