import { Sidebar } from "@/components/sidebar";
import { LayoutDashboard, KeyRound, Settings2 } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "API Keys", href: "/dashboard/keys", icon: <KeyRound size={18} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings2 size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#15181E] text-white">
      <Sidebar navItems={navItems} />
      <main className="flex-1 flex flex-col">
        <header className="px-8 py-6 border-b border-[#23272F]">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </header>
        <section className="flex-1 px-8 py-6">{children}</section>
      </main>
    </div>
  );
} 