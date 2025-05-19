"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-[#181C23] border-r border-[#23272F] flex flex-col py-6 px-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="text-xl font-bold tracking-tight text-white">API Keys</span>
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
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 