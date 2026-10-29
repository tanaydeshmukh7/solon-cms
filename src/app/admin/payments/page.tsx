'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Plus,
  Printer,
  CheckCircle2,
  Receipt,
  FileText,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Payment, PaymentMethod } from '@/types';

export default function PaymentsPage() {
  const [data, setData] = useState(getInitialData);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    amount: 85,
    paymentMethod: 'card' as PaymentMethod,
    notes: 'Settled at reception counter',
  });

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const totalCollected = data.payments.reduce((sum, p) => sum + p.amount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receipt_number: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Number(formData.amount),
      tax_amount: Number(formData.amount) * 0.08875,
      payment_method: formData.paymentMethod,
      gateway_name: formData.paymentMethod === 'online' ? 'razorpay' : 'direct',
      is_deposit: false,
      status: 'successful',
      notes: formData.notes,
      created_at: new Date().toISOString(),
    };

    saveDataState({ payments: [newPayment, ...data.payments] });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            FINANCIAL AUDIT &amp; LEDGER
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Payments &amp; Receipts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track collected funds, cash transactions, UPI payments, and online deposits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#EAA0A5]" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Collected</span>
          <p className="font-serif text-2xl font-bold text-[#201817] mt-2">
            {formatCurrency(totalCollected)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1">
            Across {data.payments.length} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Payment Gateway</span>
          <p className="font-serif text-2xl font-bold text-[#201817] mt-2">
            Razorpay / Direct
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Production abstraction ready
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Tax Collected (Est.)</span>
          <p className="font-serif text-2xl font-bold text-[#201817] mt-2">
            {formatCurrency(totalCollected * 0.08875)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">NYC 8.875% tax rate</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Receipt No.</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6E6E2]">
              {data.payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFF9F6] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-semibold text-[#B96F73]">
                    {p.receipt_number}
                  </td>
                  <td className="py-3.5 px-3 text-gray-500">
                    {formatDate(p.created_at.split('T')[0])}
                  </td>
                  <td className="py-3.5 px-3 uppercase font-semibold text-[#201817]">
                    {p.payment_method}
                  </td>
                  <td className="py-3.5 px-3 text-gray-600 max-w-xs truncate">
                    {p.notes || 'Salon service payment'}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#201817] hover:bg-[#F6E6E2] transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#F6E6E2] shadow-2xl space-y-6">
            <div className="text-center border-b border-dashed border-gray-300 pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#201817]">
                {data.settings.salon_name}
              </h3>
              <p className="text-[11px] text-gray-500">{data.settings.address}</p>
              <p className="text-[11px] text-gray-500">{data.settings.phone}</p>
              <div className="mt-3 font-mono text-xs font-bold text-[#B96F73]">
                RECEIPT: {selectedReceipt.receipt_number}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Date:</span>
                <span>{formatDate(selectedReceipt.created_at.split('T')[0])}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Payment Mode:</span>
                <span className="uppercase font-semibold text-[#201817]">
                  {selectedReceipt.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Description:</span>
                <span>{selectedReceipt.notes || 'Service settlement'}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-sm text-[#201817]">
                <span>Total Paid:</span>
                <span>{formatCurrency(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Includes Tax (8.875%):</span>
                <span>{formatCurrency(selectedReceipt.tax_amount || 0)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
              Thank you for trusting Glama Hair &amp; Beauty Studio!
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2 rounded-full border text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F6E6E2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
              <h3 className="font-serif text-xl font-semibold text-[#201817]">
                Record In-Salon Payment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Amount Received ($) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as PaymentMethod,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none"
                >
                  <option value="cash">Cash at Counter</option>
                  <option value="card">Card Terminal / POS</option>
                  <option value="upi">UPI / Instant Transfer</option>
                  <option value="online">Online Payment (Razorpay)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Internal Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C6C0] text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#F6E6E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524]"
                >
                  Confirm &amp; Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
