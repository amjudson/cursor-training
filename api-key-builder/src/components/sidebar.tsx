"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Menu, ChevronRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ navItems, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={`h-screen bg-[#181C23] border-r border-[#23272F] flex flex-col py-6 px-2 transition-all duration-200
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="mb-8 flex items-center gap-2 px-2 justify-between">
        <span className={`text-xl font-bold tracking-tight text-white transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>API Keys</span>
        <button
          className="text-gray-400 hover:text-white p-2 rounded transition-colors"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                  ${pathname === item.href ? "bg-[#23272F] text-white" : "text-gray-400 hover:bg-[#22262E] hover:text-white"}
                `}
              >
                <span>{item.icon}</span>
                <span className={`transition-all duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 