'use client';

import React from 'react';
import { Menu, Bell, Plus, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { SalonSettings } from '@/types';

interface AdminHeaderProps {
  settings: SalonSettings;
  onToggleSidebar: () => void;
  onNewBooking?: () => void;
}

export function AdminHeader({
  settings,
  onToggleSidebar,
  onNewBooking,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#F6E6E2] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Salon Open
          </span>
          <span className="text-xs text-gray-500 hidden md:inline">
            Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* WhatsApp Cloud API Mode Pill */}
        <Link
          href="/admin/whatsapp"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F6E6E2] text-[#201817] hover:bg-[#ECC7C1] transition-colors"
          title="WhatsApp Cloud API Automation Active"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#B96F73]" />
          <span>WhatsApp CRM: Active</span>
        </Link>

        {/* Quick New Booking Action */}
        <Link
          href="/book"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2D1B1A] text-white text-xs font-medium hover:bg-[#3D2524] transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#EAA0A5]" />
          <span>New Booking</span>
        </Link>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#EAA0A5] text-[#201817] font-semibold text-xs flex items-center justify-center border-2 border-white shadow-sm">
          G
        </div>
      </div>
    </header>
  );
}
