'use client';

import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';

export default function TermsAndCancellationPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold block mb-2">
            SALON POLICIES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#201817]">
            Booking &amp; Cancellation Policy
          </h1>
          <p className="text-xs text-gray-400 mt-2">Effective: October 27, 2026</p>

          <div className="prose prose-stone max-w-none text-[#201817]/80 text-sm leading-relaxed space-y-6 mt-8">
            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">1. Punctuality &amp; Arrival</h3>
              <p>
                We kindly ask that you arrive 10 minutes prior to your scheduled treatment time to allow for relaxation, refreshment, and consultation. If you anticipate being delayed, please inform us promptly.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">2. 24-Hour Cancellation Policy</h3>
              <p>
                {data.settings.cancellation_policy}
              </p>
              <p className="mt-2">
                Rescheduling your appointment with more than 24 hours notice is completely complimentary and your deposit will seamlessly transfer to the new date.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">3. Deposits &amp; Payment Options</h3>
              <p>
                For extensive treatments (such as Balayage, Chemical Smoothing, and Bridal Packages), an advance booking deposit of {data.settings.deposit_percentage}% may be requested to secure your specialist. Remaining balances can be settled via Cash, UPI, Credit Card, or Debit Card upon completion.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
