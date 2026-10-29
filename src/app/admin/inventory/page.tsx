'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { InventoryProduct, Expense, PaymentMethod } from '@/types';

export default function InventoryExpensesPage() {
  const [data, setData] = useState(getInitialData);
  const [activeTab, setActiveTab] = useState<'inventory' | 'expenses'>('inventory');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Hair Care',
    quantity: 10,
    unit_cost: 15,
    retail_price: 30,
    low_stock_threshold: 5,
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Supplies',
    amount: 100,
    payment_method: 'card' as PaymentMethod,
    notes: '',
  });

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const totalExpenseAmount = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const lowStockItems = data.inventory.filter(
    (item) => item.quantity <= item.low_stock_threshold
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: InventoryProduct = {
      id: `inv-${Date.now()}`,
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      quantity: Number(productForm.quantity),
      unit_cost: Number(productForm.unit_cost),
      retail_price: Number(productForm.retail_price),
      low_stock_threshold: Number(productForm.low_stock_threshold),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveDataState({ inventory: [newProduct, ...data.inventory] });
    setIsProductModalOpen(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      expense_date: new Date().toISOString().split('T')[0],
      payment_method: expenseForm.payment_method,
      notes: expenseForm.notes,
      created_at: new Date().toISOString(),
    };

    saveDataState({ expenses: [newExpense, ...data.expenses] });
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            STOCK CONTROL &amp; OUTLAYS
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Expenses &amp; Product Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track backbar supplies, retail stock, reorder warnings, and daily operational outlays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 rounded-full border border-[#D8C6C0] bg-white text-xs font-semibold text-[#201817] hover:bg-[#F6E6E2] transition-colors"
          >
            + Add Expense
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-colors"
          >
            + New Product
          </button>
        </div>
      </div>

      {/* Low Stock Alert Strip */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Low Stock Warning:</span> {lowStockItems.length}{' '}
              product{lowStockItems.length > 1 ? 's are' : ' is'} below minimum threshold (e.g.,{' '}
              {lowStockItems.map((i) => i.name).join(', ')}).
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
            Reorder Needed
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F6E6E2] pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'inventory'
              ? 'bg-[#2D1B1A] text-white'
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          Inventory Products ({data.inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'expenses'
              ? 'bg-[#2D1B1A] text-white'
              : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
        >
          Recorded Expenses ({data.expenses.length})
        </button>
      </div>

      {/* Inventory Tab Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Stock Qty</th>
                  <th className="py-3 px-3">Unit Cost</th>
                  <th className="py-3 px-3">Retail Price</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6E6E2]">
                {data.inventory.map((item) => {
                  const isLow = item.quantity <= item.low_stock_threshold;
                  return (
                    <tr key={item.id} className="hover:bg-[#FFF9F6] transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[#201817]">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-3 text-gray-500">{item.brand || 'Glama'}</td>
                      <td className="py-3.5 px-3 text-gray-500">{item.category}</td>
                      <td className="py-3.5 px-3 font-bold text-sm">
                        {item.quantity} units
                      </td>
                      <td className="py-3.5 px-3">{formatCurrency(item.unit_cost)}</td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-700">
                        {item.retail_price ? formatCurrency(item.retail_price) : 'N/A'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                            Low ({item.quantity} left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Tab Table */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Expense Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6E6E2]">
                {data.expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FFF9F6] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#201817]">
                      {exp.title}
                    </td>
                    <td className="py-3.5 px-3 text-gray-500">{exp.category}</td>
                    <td className="py-3.5 px-3 text-gray-500">
                      {formatDate(exp.expense_date)}
                    </td>
                    <td className="py-3.5 px-3 uppercase text-gray-600 font-medium">
                      {exp.payment_method}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-rose-700">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-gray-400 max-w-xs truncate">
                      {exp.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals for Product & Expense */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F6E6E2] shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#201817]">
              Add Inventory Product
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    value={productForm.unit_cost}
                    onChange={(e) => setProductForm({ ...productForm, unit_cost: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Low Stock Alert At</label>
                  <input
                    type="number"
                    value={productForm.low_stock_threshold}
                    onChange={(e) => setProductForm({ ...productForm, low_stock_threshold: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F6E6E2] shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#201817]">
              Record Salon Expense
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  placeholder="E.g., Flower arrangement refresh"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Supplies">Product Supplies</option>
                    <option value="Ambience">Salon Ambience &amp; Decor</option>
                    <option value="Utilities">Utilities &amp; Rent</option>
                    <option value="Staff">Staff Refreshments</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Payment Method</label>
                <select
                  value={expenseForm.payment_method}
                  onChange={(e) => setExpenseForm({ ...expenseForm, payment_method: e.target.value as PaymentMethod })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
