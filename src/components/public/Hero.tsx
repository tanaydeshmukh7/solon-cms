'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { SalonSettings } from '@/types';

interface HeroProps {
  settings?: SalonSettings;
}

export function Hero({ settings }: HeroProps) {
  const salonName = settings?.salon_name || 'Glama Hair & Beauty Studio';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F6] via-[#FDF4F2] to-[#FFF9F6] pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Subtle ambient luxury light orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#F6E6E2]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#EAA0A5]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 relative z-10">
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73]">
                LOOK GOOD • FEEL AMAZING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] font-medium text-[#201817] tracking-tight">
              Expert Care for <br />
              <span className="italic font-normal text-[#2D1B1A] font-serif">
                Your <span className="text-[#B96F73]">Hair &amp; Beauty</span>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#201817]/75 max-w-xl font-normal leading-relaxed pt-1">
              From stylish haircuts to radiant skin and flawless makeup —
              experience premium beauty services in a relaxing and luxurious
              salon environment.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 text-[#EAA0A5] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#FFF9F6] border border-[#D8C6C0] text-[#201817] text-sm font-medium hover:bg-[#F6E6E2] transition-all duration-300"
              >
                View Services
              </Link>
            </div>

            {/* Verified Trust Proof Strip */}
            <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-6 border-t border-[#F6E6E2]">
              {/* Overlapping Client Avatars */}
              <div className="flex -space-x-3 items-center">
                <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                    alt="Glama Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Glama Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Glama Client"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text Metric */}
              <div>
                <p className="text-sm font-semibold text-[#201817]">5,000+</p>
                <p className="text-xs text-[#201817]/60">Happy Clients</p>
              </div>

              <div className="hidden sm:block w-px h-8 bg-[#D8C6C0]/50" />

              {/* Rating */}
              <div>
                <div className="flex items-center gap-1 text-[#E5A93C]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-current stroke-none"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#201817]/75 font-medium mt-0.5">
                  <span className="font-semibold text-[#201817]">4.9/5</span> (800+ Reviews)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Handwritten Annotation */}
          <div className="lg:col-span-5 relative">
            {/* Handwritten Floating Script Annotation */}
            <div className="absolute -top-6 right-4 sm:-top-8 sm:right-10 z-20 pointer-events-none transform -rotate-3 select-none">
              <span className="font-script text-3xl sm:text-4xl text-[#B96F73] drop-shadow-sm block">
                Beauty Looks Good
              </span>
              <span className="font-script text-2xl sm:text-3xl text-[#B96F73] text-right block -mt-1 mr-4">
                on You ♡
              </span>
            </div>

            {/* Editorial Portrait Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative blush frame behind image */}
              <div className="absolute inset-0 bg-[#F6E6E2] rounded-[36px] transform rotate-2 scale-[1.02] shadow-xl" />

              {/* Main Beauty Photograph */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
                  alt="Glama Salon Luxury Beauty Transformation"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md py-3 px-5 rounded-2xl shadow-lg border border-[#F6E6E2] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73]">
                  <Star className="w-5 h-5 fill-current stroke-none" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#201817]">Premier Luxury Studio</p>
                  <p className="text-[11px] text-[#201817]/65">New York, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
