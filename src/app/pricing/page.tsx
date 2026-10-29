'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';

export default function PricingPage() {
  const data = getInitialData();

  const packages = [
    {
      name: 'Essential Beauty Refresh',
      price: 135,
      description: 'The quintessential monthly maintenance session for effortless polish.',
      features: [
        'Signature Haircut & Bouncy Blowdry',
        'Scalp Detox Cleanse & Hydration Mask',
        'Express Glow Rose Quartz Facial',
        'Complimentary Herbal Infusion Beverage',
      ],
      popular: false,
    },
    {
      name: 'Signature Luxe Day',
      price: 260,
      description: 'Our most sought-after full-body beauty transformation ritual.',
      features: [
        'Balayage Refresh or Hair Gloss Glaze',
        'Deep Cleansing Oxygen Hydrating Facial',
        'Luxe Russian BIAB Manicure & Nail Art',
        'Keratin Lash Lift & Brow Lamination',
        'Deluxe Take-Home Care Elixir',
      ],
      popular: true,
    },
    {
      name: 'Royal Bride Couture',
      price: 490,
      description: 'Comprehensive wedding beauty styling for the most momentous day of your life.',
      features: [
        'Pre-Wedding Full Trial Session',
        'Airbrushed HD Bridal Makeup & 3D Mink Lashes',
        'Couture Bridal Hair Updo & Veil Drape',
        'Luxury Bridal Suite Hospitality',
        'Custom 24-Hour Emergency Touch-up Kit',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              TRANSPARENT LUXURY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              Curated Packages &amp; Investment
            </h1>
            <p className="text-sm sm:text-base text-[#201817]/70 mt-3 leading-relaxed">
              Transparent, all-inclusive luxury packages with zero hidden fees. All prices include customized consultations and premier backbar products.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-3xl p-8 border transition-all flex flex-col justify-between relative ${
                  pkg.popular
                    ? 'bg-[#2D1B1A] text-white border-[#2D1B1A] shadow-2xl scale-[1.02]'
                    : 'bg-white text-[#201817] border-[#F6E6E2] shadow-sm hover:shadow-xl'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#EAA0A5] text-[#201817] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    Most Requested
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight">
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      pkg.popular ? 'text-white/70' : 'text-[#201817]/65'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  <div className="mt-6 mb-8">
                    <span className="font-serif text-4xl sm:text-5xl font-bold">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span
                      className={`text-xs ml-1 ${
                        pkg.popular ? 'text-white/60' : 'text-gray-400'
                      }`}
                    >
                      / complete package
                    </span>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            pkg.popular
                              ? 'bg-[#EAA0A5] text-[#201817]'
                              : 'bg-[#F6E6E2] text-[#B96F73]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={
                            pkg.popular ? 'text-white/90' : 'text-[#201817]/85'
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    href="/book"
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold transition-all shadow-md ${
                      pkg.popular
                        ? 'bg-[#EAA0A5] text-[#201817] hover:bg-white'
                        : 'bg-[#2D1B1A] text-white hover:bg-[#3D2524]'
                    }`}
                  >
                    <span>Reserve Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
