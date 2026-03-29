import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeCam — Sign In",
  description: "Sign in or create your VibeCam account to share recordings.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
