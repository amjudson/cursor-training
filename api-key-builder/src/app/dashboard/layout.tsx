import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Key Management",
  description: "Manage your API keys",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 