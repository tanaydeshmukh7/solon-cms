'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Award, Heart, Shield, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';

export default function AboutPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFF9F6] to-[#FDF4F2] text-center px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              OUR HERITAGE &amp; PHILOSOPHY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#201817] tracking-tight">
              Crafting Timeless Beauty
            </h1>
            <p className="text-base sm:text-lg text-[#201817]/75 max-w-2xl mx-auto leading-relaxed">
              Founded on the belief that genuine luxury lies in personalized care and meticulous technique,
              Glama brings haute editorial styling into an intimate, warm sanctuary.
            </p>
          </div>
        </section>

        {/* Split Story Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
                alt="Glama Salon Architecture"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B96F73]">
                THE GLAMA SANCTUARY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#201817]">
                A Modern Space Designed for Rejuvenation
              </h2>
              <p className="text-sm sm:text-base text-[#201817]/80 leading-relaxed">
                From custom arched golden mirrors to plush rose velvet seating and soft ambient lighting,
                every touchpoint at Glama is engineered to melt away the rush of everyday life.
                We pair medical-grade botanical skincare with European master cutting techniques to ensure
                your look is effortless, radiant, and uniquely yours.
              </p>
              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md"
                >
                  <span>Experience Glama</span>
                  <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stylists Team Showcase */}
        <section className="py-20 bg-white border-y border-[#F6E6E2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
                MEET OUR ARTISTS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#201817] mt-1">
                The Master Stylists
              </h2>
              <p className="text-sm text-[#201817]/70 mt-2">
                Our certified specialists bring decades of combined experience in high-fashion beauty, precision cuts, and bridal elegance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.stylists.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#FFF9F6] rounded-3xl p-6 border border-[#F6E6E2] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F6E6E2] mb-4">
                      <Image
                        src={st.photo_url}
                        alt={st.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#201817]">
                      {st.name}
                    </h3>
                    <p className="text-xs font-medium text-[#B96F73] mt-0.5">
                      {st.title}
                    </p>
                    <p className="text-xs text-[#201817]/70 mt-2 line-clamp-3">
                      {st.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F6E6E2] flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-[#E5A93C] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current stroke-none" />
                      {st.rating}
                    </span>
                    <span>{st.experience_years} Years Exp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
