'use client';

import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';

export default function PrivacyPolicyPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold block mb-2">
            LEGAL &amp; COMPLIANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#201817]">
            Privacy Policy &amp; Messaging Disclosures
          </h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: October 27, 2026</p>

          <div className="prose prose-stone max-w-none text-[#201817]/80 text-sm leading-relaxed space-y-6 mt-8">
            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">1. Information We Collect</h3>
              <p>
                When you make an appointment at Glama Hair &amp; Beauty Studio, we collect your full name, mobile telephone number, email address (optional), service preferences, and stylist choices.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">2. WhatsApp Business Communications</h3>
              <p>
                We use the Meta WhatsApp Business Cloud API to provide automated transactional notifications:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Appointment confirmation notices with your reference code</li>
                <li>24-hour upcoming appointment reminders</li>
                <li>Post-service care instructions and voluntary review requests</li>
                <li>30-day haircut maintenance reminders (for haircut services)</li>
              </ul>
              <p className="mt-2">
                We only send WhatsApp notifications if you explicitly opted in during the booking flow. You may opt out at any time by replying <strong>STOP</strong> or notifying salon staff.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-semibold text-[#201817]">3. Data Security</h3>
              <p>
                Customer contact details and appointment history are stored within secure, row-level-protected PostgreSQL databases. We never sell, lease, or share personal contact data with third-party advertising networks.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
