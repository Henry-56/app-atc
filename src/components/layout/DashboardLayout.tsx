'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Lightbulb, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/data-store';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { lastUpdate } = useData();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <TrendingUp size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">StorePulse AI</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 truncate">Manager Plaza</p>
                <p className="text-[10px] text-slate-500 truncate">Store #402</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-slate-900 capitalize hidden sm:block">
              {pathname.split('/').pop() || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live update: {mounted ? lastUpdate.toLocaleTimeString() : '--:--:--'}
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
