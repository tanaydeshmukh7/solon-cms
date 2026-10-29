'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Scissors,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { formatCurrency, formatDate, formatTime12h } from '@/lib/utils';
import { Appointment, AppointmentStatus } from '@/types';

export default function CalendarPage() {
  const [data, setData] = useState(getInitialData);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedStylistFilter, setSelectedStylistFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return data.appointments.filter((apt) => {
      const matchDate = apt.appointment_date === selectedDate;
      const matchStylist =
        selectedStylistFilter === 'all' || apt.stylist_id === selectedStylistFilter;
      const matchStatus =
        selectedStatusFilter === 'all' || apt.status === selectedStatusFilter;
      return matchDate && matchStylist && matchStatus;
    });
  }, [data.appointments, selectedDate, selectedStylistFilter, selectedStatusFilter]);

  const changeDateBy = (days: number) => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleUpdateStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    const updated = data.appointments.map((a) => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : a.completed_at,
          cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : a.cancelled_at,
          updated_at: new Date().toISOString(),
        };
      }
      return a;
    });

    saveDataState({ appointments: updated });
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            SCHEDULING &amp; DISPATCH
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Appointment Calendar
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review daily artist shifts, prevent overlapping bookings, and transition appointment states.
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-[#F6E6E2] shadow-sm">
          <button
            onClick={() => changeDateBy(-1)}
            aria-label="Previous day"
            className="p-2 rounded-xl hover:bg-[#F6E6E2] text-[#201817] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold text-[#201817] bg-transparent focus:outline-none"
          />
          <button
            onClick={() => changeDateBy(1)}
            aria-label="Next day"
            className="p-2 rounded-xl hover:bg-[#F6E6E2] text-[#201817] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Filter:
        </span>
        <select
          value={selectedStylistFilter}
          onChange={(e) => setSelectedStylistFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl border border-[#D8C6C0] bg-white text-[#201817] focus:outline-none"
        >
          <option value="all">All Specialists</option>
          {data.stylists.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl border border-[#D8C6C0] bg-white text-[#201817] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#F6E6E2]">
          <h2 className="font-serif text-lg font-semibold text-[#201817]">
            Schedule for {formatDate(selectedDate)}
          </h2>
          <span className="text-xs text-gray-500">
            {filteredAppointments.length} Bookings Scheduled
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-2">
            <CalendarDays className="w-12 h-12 text-[#D8C6C0] mx-auto" />
            <p className="text-sm font-medium text-gray-600">
              No appointments scheduled for this date.
            </p>
            <p className="text-xs">
              Use the online booking flow or click New Booking to manually schedule a client.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F6E6E2] mt-2">
            {filteredAppointments.map((apt) => {
              const customer = data.customers.find((c) => c.id === apt.customer_id);
              const stylist = data.stylists.find((s) => s.id === apt.stylist_id);

              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FFF9F6] p-3 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F6E6E2] flex flex-col items-center justify-center text-[#B96F73] shrink-0 font-medium">
                      <span className="text-xs font-bold leading-none">
                        {formatTime12h(apt.start_time).split(' ')[0]}
                      </span>
                      <span className="text-[10px] uppercase mt-0.5">
                        {formatTime12h(apt.start_time).split(' ')[1]}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-semibold text-[#201817]">
                          {apt.service_name_snapshot}
                        </h3>
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {apt.reference_code}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Client: <strong>{customer?.full_name || 'Guest'}</strong> ({customer?.phone})
                      </p>
                      <p className="text-xs text-[#B96F73] mt-0.5 font-medium">
                        Stylist: {stylist ? stylist.name : 'Unassigned'} &bull; {apt.service_duration_snapshot} mins
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#201817]">
                        {formatCurrency(apt.total_amount)}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : apt.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F6E6E2] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#B96F73] uppercase tracking-wider">
                  {selectedAppointment.reference_code}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#201817]">
                  {selectedAppointment.service_name_snapshot}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#201817]/80">
              <p>
                <strong>Date &amp; Time:</strong> {formatDate(selectedAppointment.appointment_date)} at {formatTime12h(selectedAppointment.start_time)}
              </p>
              <p>
                <strong>Stylist:</strong> {data.stylists.find((s) => s.id === selectedAppointment.stylist_id)?.name || 'Any'}
              </p>
              <p>
                <strong>Total Investment:</strong> {formatCurrency(selectedAppointment.total_amount)}
              </p>
              {selectedAppointment.customer_notes && (
                <p className="p-3 bg-[#FFF9F6] rounded-xl border border-[#F6E6E2]">
                  <strong>Client Note:</strong> {selectedAppointment.customer_notes}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#F6E6E2] space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Update Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedAppointment.id, 'completed')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAppointment.id, 'confirmed')}
                  className="px-3 py-1.5 rounded-xl bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524]"
                >
                  Mark Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAppointment.id, 'cancelled')}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
