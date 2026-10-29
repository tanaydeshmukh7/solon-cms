'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { SalonSettings } from '@/types';

export default function WebsiteCMSPage() {
  const [data, setData] = useState(getInitialData);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [settings, setSettings] = useState<SalonSettings>(data.settings);

  useEffect(() => {
    const handleUpdate = () => {
      const current = getInitialData();
      setData(current);
      setSettings(current.settings);
    };
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDataState({ settings });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            BRAND &amp; CONTENT
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Website Content &amp; Settings CMS
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Rename the salon, update hours, contact info, and policies. Changes are reflected live on the customer website.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D8C6C0] bg-white text-xs font-semibold text-[#201817] hover:bg-[#F6E6E2] transition-colors self-start sm:self-auto"
        >
          <span>Preview Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#B96F73]" />
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Website settings updated and saved successfully! Changes are immediately live.
          </span>
        </div>
      )}

      {/* Main CMS Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Salon Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#201817] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B96F73]" />
            Salon Identity &amp; Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Salon Name *
              </label>
              <input
                type="text"
                required
                value={settings.salon_name}
                onChange={(e) =>
                  setSettings({ ...settings, salon_name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#201817] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#B96F73]" />
            Location &amp; Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Concierge Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Physical Salon Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Booking Policies & Deposit */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#201817] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#B96F73]" />
            Operating Rules &amp; Automation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Online Deposit (%)
              </label>
              <input
                type="number"
                value={settings.deposit_percentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_percentage: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Booking Slot Interval (Mins)
              </label>
              <input
                type="number"
                value={settings.booking_slot_interval_minutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    booking_slot_interval_minutes: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                Haircut Reminder Delay (Days)
              </label>
              <input
                type="number"
                value={settings.haircut_reminder_days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    haircut_reminder_days: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5 text-xs">
              Cancellation &amp; Rescheduling Policy Statement
            </label>
            <textarea
              rows={3}
              value={settings.cancellation_policy}
              onChange={(e) =>
                setSettings({ ...settings, cancellation_policy: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none focus:border-[#B96F73]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-md"
          >
            <Save className="w-4 h-4 text-[#EAA0A5]" />
            <span>Publish Content Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
