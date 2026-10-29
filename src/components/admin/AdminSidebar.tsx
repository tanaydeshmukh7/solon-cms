'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  UserCheck,
  Globe,
  CreditCard,
  Package,
  MessageSquare,
  BarChart3,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { SalonSettings } from '@/types';

interface AdminSidebarProps {
  settings: SalonSettings;
  isOpen: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ settings, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/calendar', icon: CalendarDays },
    { name: 'Customer CRM', href: '/admin/customers', icon: Users },
    { name: 'Services & Menu', href: '/admin/services', icon: Scissors },
    { name: 'Staff & Shifts', href: '/admin/staff', icon: UserCheck },
    { name: 'Website CMS', href: '/admin/cms', icon: Globe },
    { name: 'Payments & Billing', href: '/admin/payments', icon: CreditCard },
    { name: 'Inventory & Expenses', href: '/admin/inventory', icon: Package },
    { name: 'WhatsApp CRM', href: '/admin/whatsapp', icon: MessageSquare },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#201817] text-white flex flex-col justify-between transition-transform duration-300 border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EAA0A5]/20 flex items-center justify-center text-[#EAA0A5]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold tracking-tight text-white leading-none">
                  {settings.salon_name.split(' ')[0] || 'Glama'}
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-[#EAA0A5] font-medium block mt-1">
                  Owner OS &bull; Studio CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EAA0A5] text-[#201817] font-semibold shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#EAA0A5]" />
              View Public Website
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
              Live
            </span>
          </Link>

          <div className="px-3.5 py-2 text-[11px] text-white/40 border-t border-white/5 flex items-center justify-between">
            <span>Owner Admin</span>
            <span className="text-emerald-400 font-medium">● Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
}
