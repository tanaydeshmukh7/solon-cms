'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UserCheck,
  Plus,
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  Edit2,
  Shield,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { Stylist } from '@/types';

export default function StaffManagerPage() {
  const [data, setData] = useState(getInitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);

  const [formData, setFormData] = useState<Partial<Stylist>>({
    name: '',
    title: 'Senior Stylist',
    bio: '',
    experience_years: 5,
    rating: 4.95,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    is_active: true,
  });

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const handleOpenCreate = () => {
    setEditingStylist(null);
    setFormData({
      name: '',
      title: 'Senior Stylist',
      bio: '',
      experience_years: 5,
      rating: 4.95,
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: Stylist) => {
    setEditingStylist(st);
    setFormData(st);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    const updated = data.stylists.map((st) =>
      st.id === id ? { ...st, is_active: !st.is_active } : st
    );
    saveDataState({ stylists: updated });
  };

  const handleSaveStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingStylist) {
      const updated = data.stylists.map((st) =>
        st.id === editingStylist.id
          ? ({ ...st, ...formData, updated_at: new Date().toISOString() } as Stylist)
          : st
      );
      saveDataState({ stylists: updated });
    } else {
      const newStylist: Stylist = {
        id: `stylist-${Date.now()}`,
        name: formData.name!,
        title: formData.title || 'Senior Stylist',
        bio: formData.bio || '',
        photo_url:
          formData.photo_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        experience_years: Number(formData.experience_years) || 5,
        rating: 5.0,
        review_count: 1,
        display_order: data.stylists.length + 1,
        is_active: formData.is_active ?? true,
        services: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveDataState({ stylists: [...data.stylists, newStylist] });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            TEAM &amp; ROSTERS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Stylists &amp; Shift Schedules
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage artist profiles, booking availability, and shift assignments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#EAA0A5]" />
          <span>Add New Specialist</span>
        </button>
      </div>

      {/* Stylist Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.stylists.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-3xl p-6 border border-[#F6E6E2] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#F6E6E2] shrink-0 border border-white shadow-sm">
                  <Image
                    src={st.photo_url}
                    alt={st.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-semibold text-[#201817]">
                      {st.name}
                    </h3>
                    <button
                      onClick={() => handleToggleActive(st.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        st.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {st.is_active ? 'Active' : 'On Leave'}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-[#B96F73] mt-0.5">
                    {st.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {st.bio}
                  </p>
                </div>
              </div>

              {/* Working Hours Snapshot */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium text-[#201817]">
                    <Clock className="w-3.5 h-3.5 text-[#B96F73]" />
                    Standard Working Hours
                  </span>
                  <span>Mon – Sat: 09:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <span>Daily Lunch Break</span>
                  <span>13:00 – 14:00 (1 Hour)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F6E6E2] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-semibold text-gray-600">
                <Star className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
                {st.rating} ({st.review_count || 1} client reviews)
              </span>

              <button
                onClick={() => handleOpenEdit(st)}
                className="text-xs font-semibold text-[#B96F73] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F6E6E2] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
              <h3 className="font-serif text-2xl font-semibold text-[#201817]">
                {editingStylist ? 'Edit Stylist Profile' : 'Add New Specialist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStylist} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Professional Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Bio / Specialties
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#F6E6E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-full border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
