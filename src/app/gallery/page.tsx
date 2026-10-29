'use client';

import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { TransformationsGallery } from '@/components/public/TransformationsGallery';
import { getInitialData } from '@/lib/data-store';

export default function GalleryPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center mb-6">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
            PORTFOLIO OF ARTISTRY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] tracking-tight mt-1">
            Real Transformations
          </h1>
          <p className="text-sm sm:text-base text-[#201817]/70 mt-2 max-w-xl mx-auto">
            Explore our curated work across lived-in balayage, bridal couture, radiant facials, and luxury Russian nail artistry.
          </p>
        </div>

        <TransformationsGallery transformations={data.transformations} />
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
