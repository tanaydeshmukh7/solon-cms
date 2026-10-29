'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { getInitialData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';

export default function ReportsAnalyticsPage() {
  const [data, setData] = useState(getInitialData);
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const totalRevenue = useMemo(
    () => data.payments.reduce((sum, p) => sum + p.amount, 0),
    [data.payments]
  );

  const totalExpenses = useMemo(
    () => data.expenses.reduce((sum, e) => sum + e.amount, 0),
    [data.expenses]
  );

  const netProfit = totalRevenue - totalExpenses;

  // Service Popularity Count
  const serviceStats = useMemo(() => {
    const countMap: Record<string, { name: string; count: number; revenue: number }> = {};
    data.appointments.forEach((apt) => {
      if (!countMap[apt.service_name_snapshot]) {
        countMap[apt.service_name_snapshot] = {
          name: apt.service_name_snapshot,
          count: 0,
          revenue: 0,
        };
      }
      countMap[apt.service_name_snapshot].count += 1;
      countMap[apt.service_name_snapshot].revenue += apt.total_amount;
    });
    return Object.values(countMap).sort((a, b) => b.count - a.count);
  }, [data.appointments]);

  // Stylist Performance
  const stylistStats = useMemo(() => {
    return data.stylists.map((st) => {
      const appointments = data.appointments.filter((a) => a.stylist_id === st.id);
      const revenue = appointments.reduce((sum, a) => sum + a.total_amount, 0);
      return {
        stylist: st,
        appointmentsCount: appointments.length,
        revenue,
      };
    });
  }, [data.stylists, data.appointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            BUSINESS INTELLIGENCE
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Reports &amp; Financial Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Comprehensive revenue breakdowns, stylist utilization, customer retention, and treatment margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8C6C0] bg-white text-xs font-semibold text-[#201817] hover:bg-[#F6E6E2] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#B96F73]" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Gross Revenue</span>
          <p className="font-serif text-3xl font-bold text-[#201817] mt-2">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            Verified in-salon &amp; online deposits
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Operational Outlays</span>
          <p className="font-serif text-3xl font-bold text-rose-700 mt-2">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Supplies, decor &amp; backbar costs
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F6E6E2] shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Estimated Net Salon Profit</span>
          <p className="font-serif text-3xl font-bold text-emerald-700 mt-2">
            {formatCurrency(netProfit)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Net operating margin: ~{totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Grid: Popular Services & Stylist Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-semibold text-[#201817]">
            Service Performance &amp; Popularity
          </h3>
          <p className="text-xs text-gray-500">
            Ranked by booking volume and gross revenue generated.
          </p>

          <div className="space-y-3 pt-2">
            {serviceStats.map((srv, idx) => (
              <div
                key={srv.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EAA0A5]/20 flex items-center justify-center font-bold text-[#B96F73] text-[11px]">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[#201817]">{srv.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {srv.count} appointment{srv.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#201817]">
                  {formatCurrency(srv.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stylist Productivity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-semibold text-[#201817]">
            Specialist Utilization &amp; Output
          </h3>
          <p className="text-xs text-gray-500">
            Appointments fulfilled and revenue generated per team artist.
          </p>

          <div className="space-y-3 pt-2">
            {stylistStats.map((st) => (
              <div
                key={st.stylist.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] text-xs"
              >
                <div>
                  <p className="font-semibold text-[#201817]">{st.stylist.name}</p>
                  <p className="text-[11px] text-[#B96F73] font-medium">
                    {st.stylist.title} &bull; {st.appointmentsCount} appointments
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#201817]">
                    {formatCurrency(st.revenue)}
                  </p>
                  <p className="text-[11px] text-gray-400">★ {st.stylist.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
