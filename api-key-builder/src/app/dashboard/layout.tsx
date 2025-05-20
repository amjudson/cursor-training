"use client";

import { Sidebar } from "@/components/sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#15181E] text-white">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <main className="flex-1 flex flex-col transition-all duration-200">
        <header className="px-1 py-1 border-b border-[#23272F]">
          <h1 className="text-base font-bold tracking-tight ps-3">Dashboard</h1>
        </header>
        <section className="flex-1 px-1 py-1">{children}</section>
      </main>
    </div>
  );
} 