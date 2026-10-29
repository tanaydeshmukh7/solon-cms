'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency, formatDate, formatTime12h } from '@/lib/utils';
import { Appointment, AppointmentStatus } from '@/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState(getInitialData);

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  // Today's date YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Metrics calculations
  const metrics = useMemo(() => {
    const totalAppointments = data.appointments.length;
    const completed = data.appointments.filter((a) => a.status === 'completed');
    const upcoming = data.appointments.filter(
      (a) => ['pending', 'confirmed'].includes(a.status)
    );
    const cancelled = data.appointments.filter((a) => a.status === 'cancelled');

    // Today's appointments
    const todayAppointments = data.appointments.filter(
      (a) => a.appointment_date === todayStr
    );

    // Revenue
    const revenueCollected = data.payments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingBalances = data.appointments
      .filter((a) => a.status !== 'cancelled')
      .reduce((sum, a) => sum + (a.total_amount - (a.deposit_amount || 0)), 0);

    // Customers
    const totalCustomers = data.customers.length;
    const returningCustomers = data.customers.filter((c) => c.total_visits > 1).length;
    const repeatRate =
      totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;

    // Cancellation rate
    const cancelRate =
      totalAppointments > 0 ? Math.round((cancelled.length / totalAppointments) * 100) : 0;

    // Pending WhatsApp reminders
    const pendingReminders = data.reminderJobs.filter((r) => r.status === 'pending');

    return {
      todayCount: todayAppointments.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      revenueCollected,
      outstandingBalances,
      totalCustomers,
      repeatRate,
      cancelRate,
      pendingRemindersCount: pendingReminders.length,
    };
  }, [data, todayStr]);

  // Update appointment status helper
  const handleUpdateStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    const updated = data.appointments.map((apt) => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : apt.completed_at,
          cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : apt.cancelled_at,
          updated_at: new Date().toISOString(),
        };
      }
      return apt;
    });

    // If marked completed and it's a haircut service, trigger 30-day haircut reminder!
    const targetApt = data.appointments.find((a) => a.id === appointmentId);
    let updatedReminders = [...data.reminderJobs];

    if (newStatus === 'completed' && targetApt) {
      const service = data.services.find((s) => s.id === targetApt.service_id);
      const customer = data.customers.find((c) => c.id === targetApt.customer_id);

      if (service?.is_haircut && customer && customer.whatsapp_consent && !customer.whatsapp_opt_out) {
        const scheduledTime = new Date();
        scheduledTime.setDate(scheduledTime.getDate() + (data.settings.haircut_reminder_days || 30));

        const reminderKey = `haircut_30d_${targetApt.id}`;
        if (!updatedReminders.some((r) => r.idempotency_key === reminderKey)) {
          updatedReminders.push({
            id: `rem-${Date.now()}`,
            idempotency_key: reminderKey,
            appointment_id: targetApt.id,
            customer_id: customer.id,
            job_type: 'haircut_30d_followup',
            scheduled_for: scheduledTime.toISOString(),
            status: 'pending',
            attempts: 0,
            max_attempts: 3,
            template_name: 'glama_haircut_30d_reminder',
            template_parameters: {
              customer_name: customer.full_name,
              service_name: targetApt.service_name_snapshot,
              salon_name: data.settings.salon_name,
              booking_url: 'https://glamasalon.com/book',
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }

    saveDataState({
      appointments: updated,
      reminderJobs: updatedReminders,
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Salon Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Salon Operating Metrics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time financial, scheduling, and WhatsApp CRM data for {data.settings.salon_name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/calendar"
            className="px-4 py-2 rounded-xl bg-white border border-[#D8C6C0] text-xs font-semibold text-[#201817] hover:bg-[#F6E6E2] transition-colors"
          >
            Open Calendar
          </Link>
          <Link
            href="/admin/whatsapp"
            className="px-4 py-2 rounded-xl bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#EAA0A5]" />
            <span>WhatsApp Queue ({metrics.pendingRemindersCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue Collected */}
        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Revenue Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-2xl font-bold text-[#201817]">
              {formatCurrency(metrics.revenueCollected)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Outstanding balances: {formatCurrency(metrics.outstandingBalances)}
            </p>
          </div>
        </div>

        {/* Card 2: Upcoming Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Upcoming Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-[#F6E6E2] text-[#B96F73] flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-2xl font-bold text-[#201817]">
              {metrics.upcomingCount}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {metrics.completedCount} appointments completed
            </p>
          </div>
        </div>

        {/* Card 3: Total Clients & Retention */}
        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Customer CRM</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-2xl font-bold text-[#201817]">
              {metrics.totalCustomers}
            </p>
            <p className="text-[11px] text-[#B96F73] font-medium mt-1">
              {metrics.repeatRate}% repeat client rate
            </p>
          </div>
        </div>

        {/* Card 4: WhatsApp Automation Queue */}
        <div className="bg-white p-6 rounded-2xl border border-[#F6E6E2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">WhatsApp Reminders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-serif text-2xl font-bold text-[#201817]">
              {metrics.pendingRemindersCount} Pending
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Includes automated 30-day haircut triggers
            </p>
          </div>
        </div>
      </div>

      {/* Main Table: Recent Appointments */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#201817]">
              Recent &amp; Upcoming Appointments
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage client visits, change statuses, and trigger automatic follow-up reminders.
            </p>
          </div>
          <Link
            href="/admin/calendar"
            className="text-xs font-semibold text-[#B96F73] hover:underline flex items-center gap-1"
          >
            <span>View Full Calendar Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Stylist</th>
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6E6E2]">
              {data.appointments.slice(0, 8).map((apt) => {
                const customer = data.customers.find((c) => c.id === apt.customer_id);
                const stylist = data.stylists.find((s) => s.id === apt.stylist_id);

                return (
                  <tr key={apt.id} className="hover:bg-[#FFF9F6]/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-semibold text-[#B96F73]">
                      {apt.reference_code}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#201817]">
                        {customer?.full_name || 'Guest Client'}
                      </p>
                      <p className="text-[11px] text-gray-400">{customer?.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[#201817]">
                      {apt.service_name_snapshot}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {stylist ? stylist.name : 'Any Stylist'}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-[#201817] font-medium">
                        {formatDate(apt.appointment_date)}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {formatTime12h(apt.start_time)}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#201817]">
                      {formatCurrency(apt.total_amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'completed')}
                          title="Mark Complete (Triggers 30-day haircut reminder if applicable)"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-[#2D1B1A] text-white text-[11px] font-medium hover:bg-[#3D2524] transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
