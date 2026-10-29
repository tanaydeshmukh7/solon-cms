'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import { Service, ServiceCategory } from '@/types';

export default function ServicesManagerPage() {
  const [data, setData] = useState(getInitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    category_id: '',
    price: 85,
    duration_minutes: 60,
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    is_haircut: false,
    is_active: true,
  });

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category_id: data.categories[0]?.id || '',
      price: 85,
      duration_minutes: 60,
      description: '',
      cover_image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      is_haircut: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormData(srv);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    const updated = data.services.map((s) =>
      s.id === id ? { ...s, is_active: !s.is_active } : s
    );
    saveDataState({ services: updated });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingService) {
      const updated = data.services.map((s) =>
        s.id === editingService.id
          ? ({ ...s, ...formData, updated_at: new Date().toISOString() } as Service)
          : s
      );
      saveDataState({ services: updated });
    } else {
      const newService: Service = {
        id: `srv-${Date.now()}`,
        name: formData.name!,
        slug: formData.name!.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category_id: formData.category_id || data.categories[0].id,
        price: Number(formData.price) || 50,
        duration_minutes: Number(formData.duration_minutes) || 45,
        buffer_after_minutes: 15,
        description: formData.description || '',
        cover_image:
          formData.cover_image ||
          'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
        is_featured: false,
        is_active: formData.is_active ?? true,
        is_haircut: Boolean(formData.is_haircut),
        display_order: data.services.length + 1,
        add_ons: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveDataState({ services: [newService, ...data.services] });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            CATALOG &amp; PRICING
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Service &amp; Category Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Published modifications immediately sync with the public website booking engine.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#EAA0A5]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Haircut Reminder Flag</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6E6E2]">
              {data.services.map((srv) => {
                const category = data.categories.find((c) => c.id === srv.category_id);
                return (
                  <tr key={srv.id} className="hover:bg-[#FFF9F6] transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F6E6E2] shrink-0">
                        <Image
                          src={srv.cover_image}
                          alt={srv.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#201817] text-sm">
                          {srv.name}
                        </p>
                        <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                          {srv.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 font-medium">
                      {category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#201817]">
                      {formatCurrency(srv.price)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-500">
                      {srv.duration_minutes} mins
                    </td>
                    <td className="py-3.5 px-3">
                      {srv.is_haircut ? (
                        <span className="inline-flex items-center gap-1 text-[#B96F73] font-semibold bg-[#F6E6E2] px-2.5 py-0.5 rounded-full text-[10px]">
                          <Scissors className="w-3 h-3" />
                          30-Day Auto Reminder
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleActive(srv.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          srv.is_active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {srv.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {srv.is_active ? 'Published' : 'Archived'}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#201817] hover:bg-[#F6E6E2] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#F6E6E2] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
              <h3 className="font-serif text-2xl font-semibold text-[#201817]">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                  placeholder="E.g., Signature Scalp Detox & Cut"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none"
                  >
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none focus:border-[#B96F73]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none focus:border-[#B96F73]"
                  placeholder="Detail the consultation, premium products used, and styling outcome..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF9F6] border border-[#F6E6E2] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_haircut)}
                    onChange={(e) => setFormData({ ...formData, is_haircut: e.target.checked })}
                    className="rounded text-[#B96F73] focus:ring-[#B96F73]"
                  />
                  <span className="font-semibold text-[#201817]">
                    Flag as Haircut Service (Triggers 30-Day Automated Haircut Reminder)
                  </span>
                </label>
                <p className="text-[11px] text-gray-500 pl-6">
                  When an appointment with this service is marked completed, the system will automatically schedule a 30-day reminder job.
                </p>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
