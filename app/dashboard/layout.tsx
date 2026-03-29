import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Recordings — VibeCam",
  description: "View and manage all your VibeCam screen recordings.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
