'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Phone } from 'lucide-react';
import { SalonSettings } from '@/types';
import { initialSalonSettings } from '@/lib/mock-data';

interface AppointmentCTAProps {
  settings?: SalonSettings;
}

export function AppointmentCTA({ settings: propSettings }: AppointmentCTAProps) {
  const settings = propSettings || initialSalonSettings;

  return (
    <section className="bg-[#201817] text-white py-16 sm:py-20 relative overflow-hidden">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B96F73]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Headline & CTA Button */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#EAA0A5] block">
              LET&apos;S BEAUTY TOGETHER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-tight">
              Book Your Appointment Today
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-md font-normal leading-relaxed">
              Experience professional beauty services tailored just for you.
              Choose your preferred stylist, service, and convenient time slot.
            </p>

            <div className="pt-2">
              <Link
                href="/book"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#EAA0A5] text-[#201817] text-sm font-semibold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Middle: Beauty Portrait Peak */}
          <div className="hidden lg:block lg:col-span-3 relative h-64 sm:h-72">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Luxury Beauty Appointment"
                fill
                sizes="25vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201817] via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Floating White Info Card (Matches Reference Card) */}
          <div className="lg:col-span-4 bg-white text-[#201817] rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 space-y-5">
            {/* Scheduling */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold leading-snug">
                  Flexible Scheduling
                </h4>
                <p className="text-xs text-[#201817]/65 mt-0.5">
                  Choose a time that works for you
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold leading-snug">
                  Our Location
                </h4>
                <p className="text-xs text-[#201817]/65 mt-0.5">
                  {settings.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold leading-snug">
                  Call Us
                </h4>
                <a
                  href={`tel:${settings.phone}`}
                  className="text-xs text-[#B96F73] font-medium hover:underline block mt-0.5"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
