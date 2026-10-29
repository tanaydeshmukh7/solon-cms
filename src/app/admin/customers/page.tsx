'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  DollarSign,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Customer } from '@/types';

export default function CustomersCRMPage() {
  const [data, setData] = useState(getInitialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const filteredCustomers = useMemo(() => {
    return data.customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.full_name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });
  }, [data.customers, searchQuery]);

  // Toggle WhatsApp Opt-Out
  const handleToggleOptOut = (customerId: string) => {
    const updated = data.customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          whatsapp_opt_out: !c.whatsapp_opt_out,
          updated_at: new Date().toISOString(),
        };
      }
      return c;
    });

    saveDataState({ customers: updated });
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((prev) =>
        prev ? { ...prev, whatsapp_opt_out: !prev.whatsapp_opt_out } : null
      );
    }
  };

  // Save internal notes
  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    const updated = data.customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          notes: notesText,
          updated_at: new Date().toISOString(),
        };
      }
      return c;
    });

    saveDataState({ customers: updated });
    setSelectedCustomer((prev) => (prev ? { ...prev, notes: notesText } : null));
    setIsEditingNotes(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            RELATIONSHIP MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Customer CRM &amp; History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Lifetime visit histories, treatment preferences, spending records, and WhatsApp messaging consent statuses.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#D8C6C0] text-xs focus:outline-none focus:border-[#B96F73]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Visits</th>
                <th className="py-3 px-3">Total Spend</th>
                <th className="py-3 px-3">Last Visit</th>
                <th className="py-3 px-3">WhatsApp Status</th>
                <th className="py-3 px-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6E6E2]">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => {
                    setSelectedCustomer(cust);
                    setNotesText(cust.notes || '');
                    setIsEditingNotes(false);
                  }}
                  className="hover:bg-[#FFF9F6] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#201817] text-sm">
                      {cust.full_name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Client since {cust.created_at.split('T')[0]}
                    </p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="text-[#201817] font-medium">{cust.phone}</p>
                    <p className="text-[11px] text-gray-400">{cust.email || 'No email'}</p>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#201817]">
                    {cust.total_visits} visits
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">
                    {formatCurrency(cust.total_spent)}
                  </td>
                  <td className="py-3.5 px-3 text-gray-500">
                    {cust.last_visit_at ? formatDate(cust.last_visit_at.split('T')[0]) : 'Never'}
                  </td>
                  <td className="py-3.5 px-3">
                    {cust.whatsapp_opt_out ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full text-[10px]">
                        <ShieldAlert className="w-3 h-3" />
                        Opted Out
                      </span>
                    ) : cust.whatsapp_consent ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        Consented
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">No consent</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button className="text-xs font-semibold text-[#B96F73] hover:underline">
                      View Details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#F6E6E2] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#F6E6E2]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                  CLIENT PROFILE
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#201817] mt-0.5">
                  {selectedCustomer.full_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedCustomer.phone} &bull; {selectedCustomer.email || 'No email provided'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2]">
                <p className="text-xs text-gray-400">Total Visits</p>
                <p className="text-lg font-bold font-serif text-[#201817] mt-0.5">
                  {selectedCustomer.total_visits}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2]">
                <p className="text-xs text-gray-400">Total Spend</p>
                <p className="text-lg font-bold font-serif text-emerald-700 mt-0.5">
                  {formatCurrency(selectedCustomer.total_spent)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2]">
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="text-xs font-semibold mt-1.5 text-[#B96F73]">
                  {selectedCustomer.whatsapp_opt_out ? 'Opted Out' : 'Active'}
                </p>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Specialist Notes &amp; Formulas:
                </span>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs text-[#B96F73] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit Notes
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none focus:border-[#B96F73]"
                    placeholder="Enter hair formula, color ratio, skin sensitivities, favorite drinks..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="px-3 py-1 rounded-lg border text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1 rounded-lg bg-[#2D1B1A] text-white text-xs font-semibold"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="p-3.5 rounded-xl bg-[#FFF9F6] border border-[#F6E6E2] text-xs text-[#201817]/85">
                  {selectedCustomer.notes || 'No internal notes recorded yet for this client.'}
                </p>
              )}
            </div>

            {/* WhatsApp Consent Compliance Section */}
            <div className="pt-4 border-t border-[#F6E6E2] space-y-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                Messaging Compliance:
              </span>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <p className="font-semibold text-[#201817]">
                    WhatsApp Marketing &amp; Reminders
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Consent Source: {selectedCustomer.consent_source} &bull; Recorded {selectedCustomer.consent_recorded_at?.split('T')[0]}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleOptOut(selectedCustomer.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCustomer.whatsapp_opt_out
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {selectedCustomer.whatsapp_opt_out ? 'Re-enable Messages' : 'Enforce Opt-Out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
