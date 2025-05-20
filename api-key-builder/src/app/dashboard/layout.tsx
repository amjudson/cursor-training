"use client";

import { Sidebar } from "@/components/sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div data-testid="dashboard-layout-container" className="flex min-h-screen bg-[#15181E] text-white">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <main data-testid="dashboard-layout-main" className="flex-1 flex flex-col transition-all duration-200">
        <header data-testid="dashboard-layout-header" className="px-1 py-1 border-b border-[#23272F]">
          <h1 data-testid="dashboard-layout-title" className="text-base font-bold tracking-tight ps-3">Dashboard</h1>
        </header>
        <section data-testid="dashboard-layout-content" className="flex-1 px-1 py-1">{children}</section>
      </main>
    </div>
  );
} 