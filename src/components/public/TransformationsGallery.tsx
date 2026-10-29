'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, X, Eye } from 'lucide-react';
import { Transformation } from '@/types';
import { initialTransformations } from '@/lib/mock-data';

interface TransformationsGalleryProps {
  transformations?: Transformation[];
}

export function TransformationsGallery({
  transformations: propTransformations,
}: TransformationsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<Transformation | null>(null);
  const [showBefore, setShowBefore] = useState<boolean>(false);

  const transformations =
    propTransformations && propTransformations.length > 0
      ? propTransformations
      : initialTransformations;

  const categories = ['All', 'Hair', 'Makeup', 'Nails', 'Skin Care', 'Bridal'];

  const filteredItems =
    activeCategory === 'All'
      ? transformations
      : transformations.filter((item) =>
          item.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <section className="py-20 sm:py-28 bg-[#FFF9F6]" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              OUR WORK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              Real Transformations
            </h2>
          </div>

          {/* Filter Pills & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#EAA0A5] text-white shadow-sm'
                    : 'bg-white text-[#201817]/75 hover:bg-[#F6E6E2] border border-[#F6E6E2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setShowBefore(false);
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F6E6E2] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={item.after_image_url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="text-[10px] uppercase tracking-wider text-[#EAA0A5] font-semibold">
                  {item.category}
                </span>
                <p className="text-xs text-white font-medium line-clamp-1 mt-0.5">
                  {item.title}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-white/90">
                  <Eye className="w-3.5 h-3.5 text-[#EAA0A5]" />
                  <span>View Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Detail & Before/After Comparison Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F6E6E2]">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F6E6E2] hover:bg-[#ECC7C1] flex items-center justify-center text-[#201817] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B96F73] font-semibold">
                  {selectedItem.category} Transformation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#201817] mt-1">
                  {selectedItem.title}
                </h3>
              </div>

              {/* Before/After Toggle Controls (when before image exists) */}
              {selectedItem.before_image_url && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-[#201817]/70 font-medium">Compare:</span>
                  <div className="inline-flex rounded-full bg-[#F6E6E2] p-1">
                    <button
                      onClick={() => setShowBefore(false)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        !showBefore ? 'bg-[#2D1B1A] text-white' : 'text-[#201817]'
                      }`}
                    >
                      After (Result)
                    </button>
                    <button
                      onClick={() => setShowBefore(true)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        showBefore ? 'bg-[#2D1B1A] text-white' : 'text-[#201817]'
                      }`}
                    >
                      Before
                    </button>
                  </div>
                </div>
              )}

              {/* Image View */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6E6E2]">
                <Image
                  src={
                    showBefore && selectedItem.before_image_url
                      ? selectedItem.before_image_url
                      : selectedItem.after_image_url
                  }
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider">
                  {showBefore ? 'Before Client Visit' : 'Final Styled Result'}
                </div>
              </div>

              {selectedItem.description && (
                <p className="text-sm text-[#201817]/80 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
