"use client";

import { Sidebar } from "@/components/sidebar";
import { LayoutDashboard, KeyRound, Settings2 } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "API Keys", href: "/dashboard/keys", icon: <KeyRound size={18} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings2 size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#15181E] text-white">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <main className="flex-1 flex flex-col transition-all duration-200">
        <header className="px-1 py-1 border-b border-[#23272F]">
          <h1 className="text-base font-bold tracking-tight">Dashboard</h1>
        </header>
        <section className="flex-1 px-1 py-1">{children}</section>
      </main>
    </div>
  );
} 