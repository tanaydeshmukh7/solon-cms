'use client';

import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { getInitialData } from '@/lib/data-store';

export default function BookPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
            RESERVE YOUR APPOINTMENT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#201817] tracking-tight mt-1">
            Book an Exclusive Experience
          </h1>
          <p className="text-sm sm:text-base text-[#201817]/70 mt-2 max-w-xl mx-auto">
            Choose your signature beauty service, select your favorite artist, and pick a time that suits your schedule.
          </p>
        </div>

        <BookingWizard />
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
