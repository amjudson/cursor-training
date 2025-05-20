"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import {
  Home,
  KeyRound,
  Code2,
  Sparkles,
  CreditCard,
  Settings,
  BookOpen,
  AppWindow,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <Home size={18} /> },
  { label: "API Keys", href: "/dashboard/keys", icon: <KeyRound size={18} /> },
  { label: "API Playground", href: "/dashboard/playground", icon: <Code2 size={18} /> },
  { label: "Use Cases", href: "/dashboard/use-cases", icon: <Sparkles size={18} /> },
  { label: "Billing", href: "/dashboard/billing", icon: <CreditCard size={18} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  { label: "Documentation", href: "https://docs.aplus.com", icon: <BookOpen size={18} />, external: true },
  { label: "Tavily MCP", href: "https://mcp.aplus.com", icon: <AppWindow size={18} />, external: true },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className={`h-screen bg-[#1A2233] border-r border-[#23272F] rounded-r-2xl flex flex-col pt-1 pb-6 shadow-lg transition-all duration-200 ${collapsed ? "w-20 items-center px-0" : "w-64 px-2"}`}>
      {/* Toggle button row at the very top, right justified */}
      <div className="flex items-center justify-end mb-0 w-full" style={{ minHeight: 0 }}>
        <button
          className="text-gray-400 hover:text-white p-3 rounded transition-colors z-10"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
        </button>
      </div>
      {/* Logo/title row */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} mb-4 ${collapsed ? "px-0" : "px-2"}`}>
        <Image src="/logo-aplus.jpg" alt="A Plus Logo" width={36} height={36} className="rounded-full" />
        <span className={`text-2xl font-bold tracking-tight text-white transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>A Plus</span>
      </div>
      <nav className="flex-1 w-full">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 rounded-lg transition-colors text-sm font-medium text-gray-400 hover:bg-[#22262E] hover:text-white`}
                >
                  <span className={collapsed ? "mx-auto" : ""}>{item.icon}</span>
                  <span className={`transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.label}</span>
                  <ExternalLink size={16} className={`ml-auto opacity-70 ${collapsed ? "hidden" : "inline"}`} />
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 rounded-lg transition-colors text-sm font-medium
                    ${pathname === item.href ? "bg-[#23272F] text-white" : "text-gray-400 hover:bg-[#22262E] hover:text-white"}
                  `}
                >
                  <span className={collapsed ? "mx-auto" : ""}>{item.icon}</span>
                  <span className={`transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 