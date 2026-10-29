'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { initialTestimonials } from '@/lib/mock-data';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function Testimonials({
  testimonials: propTestimonials,
}: TestimonialsProps) {
  const testimonials =
    propTestimonials && propTestimonials.length > 0
      ? propTestimonials
      : initialTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FFF9F6]" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Left/Right Controls */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              TESTIMONIALS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              What Our Clients Say
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-[#D8C6C0] bg-white flex items-center justify-center text-[#201817] hover:bg-[#F6E6E2] hover:border-[#EAA0A5] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-[#D8C6C0] bg-white flex items-center justify-center text-[#201817] hover:bg-[#F6E6E2] hover:border-[#EAA0A5] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Review Cards Grid (Matches Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-[#F6E6E2] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 text-[#E5A93C] mb-4">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current stroke-none"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-[#201817]/85 font-normal leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client Info with Avatar */}
              <div className="mt-8 pt-6 border-t border-[#F6E6E2] flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F6E6E2] border-2 border-white shadow-sm shrink-0">
                  {item.avatar_url ? (
                    <Image
                      src={item.avatar_url}
                      alt={item.client_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#EAA0A5] text-white font-medium text-sm">
                      {item.client_name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#201817] leading-none">
                    {item.client_name}
                  </h4>
                  <p className="text-xs text-[#B96F73] font-medium mt-1">
                    {item.client_role || 'Happy Client'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
