'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import Image from 'next/image'
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
  LogOut,
} from 'lucide-react'
import { useToast } from '@/components/toast-provider'
import { useLogoutMutation } from '@/lib/store/api/authSlice'

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
  { label: 'Overview', href: '/dashboard', icon: <Home size={18} /> },
  { label: 'API Keys', href: '/dashboard/keys', icon: <KeyRound size={18} /> },
  { label: 'API Playground', href: '/dashboard/playground', icon: <Code2 size={18} /> },
  { label: 'Use Cases', href: '/dashboard/use-cases', icon: <Sparkles size={18} /> },
  { label: 'Billing', href: '/dashboard/billing', icon: <CreditCard size={18} /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
  { label: 'Documentation', href: 'https://docs.aplus.com', icon: <BookOpen size={18} />, external: true },
  { label: 'Tavily MCP', href: 'https://mcp.aplus.com', icon: <AppWindow size={18} />, external: true },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { show } = useToast()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      show({
        title: 'Success',
        description: 'Logged out successfully',
        variant: 'success',
      })
      router.push('/')
    } catch (error) {
      show({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'error',
      })
    }
  }

  return (
    <aside data-testid="sidebar-container" className={`h-screen bg-[#1A2233] border-r border-[#23272F] rounded-r-2xl flex flex-col pt-1 pb-6 shadow-lg transition-all duration-200 ${collapsed ? 'w-20 items-center px-0' : 'w-64 px-2'}`}>
      {/* Toggle button row at the very top, right justified */}
      <div className="flex items-center justify-end mb-0 w-full" style={{ minHeight: 0 }}>
        <button
          data-testid="sidebar-toggle"
          className="text-gray-400 hover:text-white p-3 rounded transition-colors z-10"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
        </button>
      </div>
      {/* Logo/title row */}
      <div data-testid="sidebar-header" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'} mb-4 ${collapsed ? 'px-0' : 'px-2'}`}>
        <Image data-testid="sidebar-logo" src="/logo-aplus.jpg" alt="A Plus Logo" width={36} height={36} className="rounded-full" />
        <span data-testid="sidebar-title" className={`text-2xl font-bold tracking-tight text-white transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>A Plus</span>
      </div>
      <nav data-testid="sidebar-navigation" className="flex-1 w-full">
        <ul data-testid="sidebar-menu" className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href} data-testid={`sidebar-menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              {item.external ? (
                <a
                  data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-colors text-sm font-medium text-gray-400 hover:bg-[#22262E] hover:text-white`}
                >
                  <span data-testid={`sidebar-icon-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className={collapsed ? 'mx-auto' : ''}>{item.icon}</span>
                  <span data-testid={`sidebar-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className={`transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{item.label}</span>
                  <ExternalLink size={16} className={`ml-auto opacity-70 ${collapsed ? 'hidden' : 'inline'}`} />
                </a>
              ) : (
                <Link
                  data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-colors text-sm font-medium
                    ${pathname === item.href ? 'bg-[#23272F] text-white' : 'text-gray-400 hover:bg-[#22262E] hover:text-white'}
                  `}
                >
                  <span data-testid={`sidebar-icon-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className={collapsed ? 'mx-auto' : ''}>{item.icon}</span>
                  <span data-testid={`sidebar-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className={`transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* Sign out button at the bottom */}
      <div className="mt-auto px-2">
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 w-full rounded-lg transition-colors text-sm font-medium text-gray-400 hover:bg-[#22262E] hover:text-white`}
        >
          <LogOut size={18} className={collapsed ? 'mx-auto' : ''} />
          <span className={`transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Sign out</span>
        </button>
      </div>
    </aside>
  )
} 