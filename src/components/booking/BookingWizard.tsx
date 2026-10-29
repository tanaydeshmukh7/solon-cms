'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Service,
  Stylist,
  SalonSettings,
  BookingStepData,
  BookingTimeSlot,
  Appointment,
} from '@/types';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { calculateAvailableSlots } from '@/lib/booking/availability';
import { validateAndCreateBooking } from '@/lib/booking/validation';
import { formatCurrency, formatDate, formatTime12h } from '@/lib/utils';

export function BookingWizard() {
  const router = useRouter();

  // Load state from data store
  const [dataState, setDataState] = useState(getInitialData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Booking Form State
  const [bookingData, setBookingData] = useState<BookingStepData>({
    serviceId: '',
    selectedAddOns: [],
    stylistId: 'any',
    date: new Date().toISOString().split('T')[0],
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerNotes: '',
    whatsappConsent: true,
    paymentOption: 'salon',
  });

  // Confirmed appointment result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Keep synced with store updates
  useEffect(() => {
    const handleUpdate = () => {
      setDataState(getInitialData());
    };
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  // Pre-select first service if none selected
  useEffect(() => {
    if (!bookingData.serviceId && dataState.services.length > 0) {
      setBookingData((prev) => ({
        ...prev,
        serviceId: dataState.services[0].id,
      }));
    }
  }, [dataState.services, bookingData.serviceId]);

  // Selected Service object
  const selectedService = useMemo(() => {
    return (
      dataState.services.find((s) => s.id === bookingData.serviceId) ||
      dataState.services[0]
    );
  }, [dataState.services, bookingData.serviceId]);

  // Selected Stylist object
  const selectedStylist = useMemo(() => {
    if (!bookingData.stylistId || bookingData.stylistId === 'any') return undefined;
    return dataState.stylists.find((st) => st.id === bookingData.stylistId);
  }, [dataState.stylists, bookingData.stylistId]);

  // Calculate available time slots for chosen service + date + stylist
  const availableSlots = useMemo(() => {
    if (!bookingData.date || !selectedService) return [];
    return calculateAvailableSlots({
      date: bookingData.date,
      serviceId: selectedService.id,
      stylistId: bookingData.stylistId,
      settings: dataState.settings,
      services: dataState.services,
      stylists: dataState.stylists,
      appointments: dataState.appointments,
    });
  }, [
    bookingData.date,
    bookingData.stylistId,
    selectedService,
    dataState.settings,
    dataState.services,
    dataState.stylists,
    dataState.appointments,
  ]);

  // Calculate pricing breakdown
  const pricing = useMemo(() => {
    if (!selectedService) return { serviceTotal: 0, addOnsTotal: 0, total: 0, deposit: 0 };
    const addOnsTotal = (selectedService.add_ons || [])
      .filter((ao) => bookingData.selectedAddOns.includes(ao.name))
      .reduce((sum, ao) => sum + ao.price, 0);

    const total = selectedService.price + addOnsTotal;
    const deposit = Math.round(total * (dataState.settings.deposit_percentage / 100));

    return {
      serviceTotal: selectedService.price,
      addOnsTotal,
      total,
      deposit,
    };
  }, [selectedService, bookingData.selectedAddOns, dataState.settings]);

  // Toggle add-ons
  const handleToggleAddOn = (addOnName: string) => {
    setBookingData((prev) => {
      const exists = prev.selectedAddOns.includes(addOnName);
      return {
        ...prev,
        selectedAddOns: exists
          ? prev.selectedAddOns.filter((name) => name !== addOnName)
          : [...prev.selectedAddOns, addOnName],
      };
    });
  };

  // Submit Final Booking
  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const validation = validateAndCreateBooking({
        data: bookingData,
        service: selectedService,
        stylist: selectedStylist,
        existingAppointments: dataState.appointments,
        existingCustomers: dataState.customers,
        settings: dataState.settings,
      });

      if (!validation.isValid || !validation.appointment) {
        setErrorMessage(validation.error || 'Unable to confirm appointment.');
        setIsLoading(false);
        return;
      }

      // Persist to data store
      const updatedAppointments = [validation.appointment, ...dataState.appointments];
      const updatedCustomers = validation.customer
        ? [
            validation.customer,
            ...dataState.customers.filter((c) => c.id !== validation.customer!.id),
          ]
        : dataState.customers;

      const updatedReminderJobs = validation.reminderJob
        ? [validation.reminderJob, ...dataState.reminderJobs]
        : dataState.reminderJobs;

      saveDataState({
        appointments: updatedAppointments,
        customers: updatedCustomers,
        reminderJobs: updatedReminderJobs,
      });

      setConfirmedAppointment(validation.appointment);
      setCurrentStep(7); // Go to Step 7 (Confirmation)

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EAA0A5', '#B96F73', '#2D1B1A', '#D8C6C0'],
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during booking.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step Indicators
  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Stylist' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Your Details' },
    { num: 5, label: 'Review & Pay' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Breadcrumb & Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-4">
          {steps.map((st, i) => {
            const isCompleted = currentStep > st.num || currentStep === 7;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 ${
                      currentStep > st.num ? 'bg-[#B96F73]' : 'bg-[#F6E6E2]'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-[#B96F73] text-white'
                      : isCurrent
                      ? 'bg-[#2D1B1A] text-white ring-4 ring-[#F6E6E2]'
                      : 'bg-white text-gray-400 border border-[#D8C6C0]'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                    isCurrent ? 'text-[#201817] font-semibold' : 'text-gray-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F6E6E2] shadow-xl">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================
            STEP 1: SELECT SERVICE
           ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                STEP 1 OF 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                Choose Your Service
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1">
                Select your luxury treatment. You can customize with optional add-ons below.
              </p>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataState.services.map((srv) => {
                const isSelected = bookingData.serviceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setBookingData((prev) => ({
                        ...prev,
                        serviceId: srv.id,
                        selectedAddOns: [], // reset add-ons for new service
                      }));
                    }}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#B96F73] bg-[#FFF9F6] ring-2 ring-[#B96F73]/20 shadow-md'
                        : 'border-[#F6E6E2] bg-white hover:border-[#D8C6C0] hover:bg-[#FFF9F6]/50'
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F6E6E2] shrink-0">
                      <Image
                        src={srv.cover_image}
                        alt={srv.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-base font-semibold text-[#201817]">
                          {srv.name}
                        </h3>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#B96F73] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#201817]/65 mt-1 line-clamp-2">
                        {srv.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#201817]">
                          {formatCurrency(srv.price)}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {srv.duration_minutes} mins
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Add-Ons Section */}
            {selectedService && selectedService.add_ons && selectedService.add_ons.length > 0 && (
              <div className="pt-4 border-t border-[#F6E6E2]">
                <h4 className="font-serif text-base font-medium text-[#201817] mb-3">
                  Enhance Your Treatment (Optional Add-Ons)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.add_ons.map((addOn) => {
                    const isChecked = bookingData.selectedAddOns.includes(addOn.name);
                    return (
                      <div
                        key={addOn.name}
                        onClick={() => handleToggleAddOn(addOn.name)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#B96F73] bg-[#FDF4F2]'
                            : 'border-[#F6E6E2] hover:bg-[#FFF9F6]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-[#B96F73] focus:ring-[#B96F73]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#201817]">
                              {addOn.name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              +{addOn.duration_minutes} mins
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#B96F73]">
                          +{formatCurrency(addOn.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Next */}
            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!bookingData.serviceId}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md disabled:opacity-50"
              >
                <span>Continue to Stylist</span>
                <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: CHOOSE STYLIST
           ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                STEP 2 OF 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                Choose Your Beauty Specialist
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1">
                Select your preferred expert or choose &apos;Any Available Stylist&apos; for maximum time slot availability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Option: Any Available Stylist */}
              <div
                onClick={() => setBookingData((prev) => ({ ...prev, stylistId: 'any' }))}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  bookingData.stylistId === 'any'
                    ? 'border-[#B96F73] bg-[#FFF9F6] ring-2 ring-[#B96F73]/20 shadow-md'
                    : 'border-[#F6E6E2] bg-white hover:border-[#D8C6C0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#201817]">
                      Any Available Stylist
                    </h3>
                    <p className="text-xs text-gray-500">First available expert</p>
                  </div>
                </div>
                <p className="text-xs text-[#201817]/65 mt-4">
                  Recommended for flexible bookings. We&apos;ll automatically assign the best available artist.
                </p>
              </div>

              {/* Specific Stylists */}
              {dataState.stylists.map((st) => {
                const isSelected = bookingData.stylistId === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setBookingData((prev) => ({ ...prev, stylistId: st.id }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#B96F73] bg-[#FFF9F6] ring-2 ring-[#B96F73]/20 shadow-md'
                        : 'border-[#F6E6E2] bg-white hover:border-[#D8C6C0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F6E6E2] shrink-0 border border-white shadow-sm">
                        <Image
                          src={st.photo_url}
                          alt={st.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-semibold text-[#201817]">
                          {st.name}
                        </h3>
                        <p className="text-xs text-[#B96F73] font-medium">{st.title}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F6E6E2] flex items-center justify-between text-xs text-gray-500">
                      <span>★ {st.rating} ({st.review_count})</span>
                      <span>{st.experience_years}+ yrs exp</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8C6C0] text-sm text-[#201817] hover:bg-[#F6E6E2] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md"
              >
                <span>Select Date &amp; Time</span>
                <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: DATE & TIME SLOTS
           ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                STEP 3 OF 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                Select Date &amp; Available Time
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1">
                Live availability is synchronized in real-time with salon operating hours and breaks.
              </p>
            </div>

            {/* Date Picker Input */}
            <div className="bg-[#FFF9F6] p-4 rounded-2xl border border-[#F6E6E2]">
              <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-2">
                Choose Appointment Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingData.date}
                onChange={(e) => {
                  setBookingData((prev) => ({
                    ...prev,
                    date: e.target.value,
                    time: '', // reset chosen time
                  }));
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#D8C6C0] bg-white text-sm text-[#201817] focus:outline-none focus:border-[#B96F73]"
              />
              <span className="ml-0 sm:ml-4 text-xs text-gray-500 block sm:inline mt-2 sm:mt-0">
                Selected: {formatDate(bookingData.date)}
              </span>
            </div>

            {/* Time Slot Grid */}
            <div>
              <h4 className="text-sm font-semibold text-[#201817] mb-3">
                Available Time Slots
              </h4>

              {availableSlots.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-sm text-gray-600">
                    The salon is closed or no appointment slots remain on this date.
                    Please choose another day.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = bookingData.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() =>
                          setBookingData((prev) => ({ ...prev, time: slot.time }))
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#2D1B1A] text-white shadow-md'
                            : 'bg-white text-[#201817] border border-[#F6E6E2] hover:border-[#B96F73] hover:bg-[#FFF9F6]'
                        }`}
                      >
                        {formatTime12h(slot.time)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8C6C0] text-sm text-[#201817] hover:bg-[#F6E6E2] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!bookingData.time}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md disabled:opacity-50"
              >
                <span>Enter Your Details</span>
                <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: CUSTOMER DETAILS & WHATSAPP CONSENT
           ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                STEP 4 OF 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                Your Contact Information
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1">
                No account required. We respect your privacy and only use this for your appointment confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Priya Sharma"
                  value={bookingData.customerName}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] bg-white text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={bookingData.customerPhone}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, customerPhone: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] bg-white text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={bookingData.customerEmail}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, customerEmail: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] bg-white text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                  Special Notes or Allergies (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any preferences, allergies, or questions for our specialists..."
                  value={bookingData.customerNotes}
                  onChange={(e) =>
                    setBookingData((prev) => ({ ...prev, customerNotes: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] bg-white text-sm focus:outline-none focus:border-[#B96F73]"
                />
              </div>
            </div>

            {/* Explicit WhatsApp Consent Box (Complies with Meta Cloud API rules) */}
            <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingData.whatsappConsent}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      whatsappConsent: e.target.checked,
                    }))
                  }
                  className="mt-1 rounded text-[#B96F73] focus:ring-[#B96F73]"
                />
                <div className="text-xs text-[#201817]/80 leading-relaxed">
                  <span className="font-semibold text-[#201817]">
                    Receive instant booking updates &amp; reminders via WhatsApp
                  </span>
                  <p className="mt-0.5 text-gray-500">
                    By checking this box, you consent to receive appointment confirmation,
                    a 24-hour reminder, and customized salon follow-ups from Glama Hair &amp; Beauty.
                    You may opt out at any time by replying STOP.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8C6C0] text-sm text-[#201817] hover:bg-[#F6E6E2] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                disabled={!bookingData.customerName || !bookingData.customerPhone}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md disabled:opacity-50"
              >
                <span>Review &amp; Confirm</span>
                <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: REVIEW & PAYMENT SELECTION
           ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
                STEP 5 OF 5
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                Review Your Appointment
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1">
                Please verify your appointment details below before confirming.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="p-6 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F6E6E2]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#201817]">
                    {selectedService.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Stylist: {selectedStylist ? selectedStylist.name : 'Any Available Stylist'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif text-2xl font-bold text-[#201817]">
                    {formatCurrency(pricing.total)}
                  </span>
                  <p className="text-xs text-gray-500">
                    Est. Duration: {selectedService.duration_minutes} mins
                  </p>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#201817]/80">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#B96F73]" />
                  <span>{formatDate(bookingData.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B96F73]" />
                  <span>{formatTime12h(bookingData.time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#B96F73]" />
                  <span>{bookingData.customerName} ({bookingData.customerPhone})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#B96F73]" />
                  <span>WhatsApp Updates: {bookingData.whatsappConsent ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              {/* Add-ons list if selected */}
              {bookingData.selectedAddOns.length > 0 && (
                <div className="pt-2 border-t border-[#F6E6E2] text-xs">
                  <span className="font-semibold text-[#201817]">Included Add-ons:</span>
                  <ul className="list-disc list-inside text-gray-600 mt-1">
                    {bookingData.selectedAddOns.map((ao) => (
                      <li key={ao}>{ao}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#201817] uppercase tracking-wider">
                Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    setBookingData((prev) => ({ ...prev, paymentOption: 'salon' }))
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    bookingData.paymentOption === 'salon'
                      ? 'border-[#B96F73] bg-[#FFF9F6] ring-2 ring-[#B96F73]/20'
                      : 'border-[#F6E6E2] bg-white'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#201817]">Pay At Salon</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Pay in person via Cash, UPI, or Card after your appointment.
                  </p>
                </div>

                <div
                  onClick={() =>
                    setBookingData((prev) => ({ ...prev, paymentOption: 'deposit_online' }))
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    bookingData.paymentOption === 'deposit_online'
                      ? 'border-[#B96F73] bg-[#FFF9F6] ring-2 ring-[#B96F73]/20'
                      : 'border-[#F6E6E2] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#201817]">
                      Pay {dataState.settings.deposit_percentage}% Deposit Online
                    </p>
                    <span className="text-xs font-bold text-[#B96F73]">
                      {formatCurrency(pricing.deposit)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Secure your slot with an online card / UPI deposit.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8C6C0] text-sm text-[#201817] hover:bg-[#F6E6E2] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Securing Appointment...</span>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <CheckCircle2 className="w-4 h-4 text-[#EAA0A5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 7: CONFIRMATION & REFERENCE RECEIPT
           ======================================================== */}
        {currentStep === 7 && confirmedAppointment && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#F6E6E2] text-[#B96F73] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold block">
                BOOKING CONFIRMED
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#201817] mt-1">
                We Can&apos;t Wait to Pamper You!
              </h2>
              <p className="text-sm text-[#201817]/70 mt-1 max-w-md mx-auto">
                Your appointment has been successfully recorded in the Glama salon schedule.
              </p>
            </div>

            {/* Booking Reference Card */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Reference Code
                </span>
                <span className="font-mono text-sm font-bold text-[#B96F73] bg-white px-3 py-1 rounded-full border border-[#F6E6E2]">
                  {confirmedAppointment.reference_code}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#201817]/85">
                <p>
                  <strong>Service:</strong> {confirmedAppointment.service_name_snapshot}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(confirmedAppointment.appointment_date)}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime12h(confirmedAppointment.start_time)}
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatCurrency(confirmedAppointment.total_amount)}
                </p>
                <p>
                  <strong>Salon Location:</strong> {dataState.settings.address}
                </p>
              </div>

              {bookingData.whatsappConsent && (
                <div className="pt-3 border-t border-[#F6E6E2] flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>
                    A confirmation message is being dispatched to {bookingData.customerPhone}.
                  </span>
                </div>
              )}
            </div>

            {/* Next Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full border border-[#D8C6C0] text-xs font-medium text-[#201817] hover:bg-[#F6E6E2] transition-colors"
              >
                Return to Homepage
              </Link>
              <Link
                href="/services"
                className="px-6 py-2.5 rounded-full bg-[#2D1B1A] text-white text-xs font-medium hover:bg-[#3D2524] transition-colors"
              >
                Browse Other Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
