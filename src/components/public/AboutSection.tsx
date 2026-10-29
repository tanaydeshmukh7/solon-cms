'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  X,
  Award,
  Users,
  Sparkles,
} from 'lucide-react';

export function AboutSection() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const highlights = [
    'Professional & Certified Experts',
    'Personalized Beauty Consultations',
    'High-Quality & Safe Products',
    'Clean, Relaxing & Stylish Salon Space',
  ];

  const stats = [
    {
      value: '10+',
      label: 'Years of Experience',
      icon: Award,
    },
    {
      value: '5,000+',
      label: 'Happy Clients',
      icon: Users,
    },
    {
      value: '20+',
      label: 'Beauty Experts',
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FFF9F6] relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Salon Interior Photo with Play Button */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-[#F6E6E2]">
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
                alt="Glama Hair & Beauty Luxury Salon Interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Central Video Play Trigger Button */}
              <button
                onClick={() => setVideoModalOpen(true)}
                aria-label="Play salon tour video"
                className="absolute inset-0 m-auto w-18 h-18 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#2D1B1A] shadow-2xl hover:scale-110 hover:bg-white transition-all duration-300 group cursor-pointer"
              >
                <Play className="w-7 h-7 fill-current translate-x-0.5 text-[#B96F73] group-hover:text-[#2D1B1A] transition-colors" />
                <span className="absolute -bottom-8 text-white text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Watch Salon Tour
                </span>
              </button>
            </div>

            {/* Decorative blush backdrop shadow */}
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-[#F6E6E2] rounded-full blur-2xl -z-10 pointer-events-none" />
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-6 space-y-6 relative">
            {/* Handwritten Floating Annotation */}
            <div className="hidden sm:block absolute -top-8 right-0 transform rotate-2 select-none pointer-events-none">
              <span className="font-script text-3xl sm:text-4xl text-[#B96F73]">
                Self care is a form of self love ♡
              </span>
            </div>

            {/* Section Eyebrow */}
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
                ABOUT US
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#201817] tracking-tight mt-1">
                Beauty Is Our Passion
              </h2>
            </div>

            {/* Story Paragraph */}
            <p className="text-sm sm:text-base text-[#201817]/75 leading-relaxed font-normal">
              At Glama Hair &amp; Beauty Salon, we believe beauty is more than
              just a look — it&apos;s a feeling. Our expert team is dedicated to
              bringing out your natural beauty with personalized care, modern
              techniques, and a luxurious salon experience.
            </p>

            {/* Checklist & Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
              {/* Feature Points */}
              <div className="sm:col-span-7 space-y-3.5">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F6E6E2] flex items-center justify-center shrink-0 text-[#B96F73]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#201817]/90">
                      {item}
                    </span>
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span>About Us</span>
                    <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
                  </Link>
                </div>
              </div>

              {/* Stats Card (Matches Reference Card) */}
              <div className="sm:col-span-5 bg-white p-5 rounded-2xl border border-[#F6E6E2] shadow-sm flex flex-col justify-around space-y-4">
                {stats.map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div key={i} className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-lg font-serif font-bold text-[#201817] leading-none">
                          {st.value}
                        </p>
                        <p className="text-[11px] text-[#201817]/65 mt-0.5">
                          {st.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
              title="Glama Studio Interior Virtual Tour"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
