'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getInitialData } from '@/lib/data-store';
import { SalonSettings } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<SalonSettings>(() => getInitialData().settings);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getInitialData().settings);
    };
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#201817] flex">
      {/* Sidebar */}
      <AdminSidebar
        settings={settings}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          settings={settings}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
