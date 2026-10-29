'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceCategory } from '@/types';
import { initialCategories } from '@/lib/mock-data';

interface ServicesGridProps {
  categories?: ServiceCategory[];
}

export function ServicesGrid({ categories }: ServicesGridProps) {
  const displayCategories = categories && categories.length > 0 ? categories : initialCategories;

  return (
    <section className="py-20 sm:py-28 bg-[#FFF9F6]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-18">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
            OUR SERVICES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#201817] tracking-tight">
            Complete Beauty Care Under One Roof
          </h2>
          <p className="text-sm sm:text-base text-[#201817]/70 leading-relaxed max-w-2xl mx-auto">
            Discover a wide range of professional hair, skin, and beauty services
            designed to enhance your natural beauty.
          </p>
        </div>

        {/* 6 Photographic Cards Grid (Matches Reference Exactly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F6E6E2] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Photo Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6E6E2]">
                <Image
                  src={category.cover_image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Footer Content */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#201817] group-hover:text-[#B96F73] transition-colors leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#201817]/65 mt-1 line-clamp-1">
                    {category.subtitle || category.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#F6E6E2]/50">
                  <span className="text-[11px] font-medium text-[#B96F73] uppercase tracking-wider">
                    Explore
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#201817] group-hover:bg-[#EAA0A5] group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View Full Service Menu Link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all duration-200 shadow-md"
          >
            <span>Explore All 20+ Treatments</span>
            <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
