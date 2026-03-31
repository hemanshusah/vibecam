import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Footer } from "@/components/Footer";
import { GlobalSupportModal } from "@/components/GlobalSupportModal";

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
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex flex-col">
              {children}
            </div>
            <Footer />
            <GlobalSupportModal />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
