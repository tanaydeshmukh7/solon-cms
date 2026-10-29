'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';

export default function ServicesPage() {
  const [data, setData] = useState(getInitialData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const filteredServices =
    selectedCategory === 'all'
      ? data.services
      : data.services.filter((s) => s.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              OUR COMPLETE MENU
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              Luxury Salon &amp; Beauty Services
            </h1>
            <p className="text-sm sm:text-base text-[#201817]/70 mt-3 leading-relaxed">
              Every appointment includes a bespoke consultation, premium products, and unmatched attention to detail.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#2D1B1A] text-white shadow'
                    : 'bg-white text-[#201817] border border-[#F6E6E2] hover:bg-[#F6E6E2]'
                }`}
              >
                All Services
              </button>
              {data.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#2D1B1A] text-white shadow'
                      : 'bg-white text-[#201817] border border-[#F6E6E2] hover:bg-[#F6E6E2]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#F6E6E2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F6E6E2]">
                    <Image
                      src={service.cover_image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#201817]">
                      {formatCurrency(service.price)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Clock className="w-3.5 h-3.5 text-[#B96F73]" />
                      <span>{service.duration_minutes} Minutes</span>
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-[#201817] group-hover:text-[#B96F73] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#201817]/70 mt-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Add-ons preview */}
                    {service.add_ons && service.add_ons.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#F6E6E2] text-xs">
                        <span className="text-gray-400 font-medium">Available Add-ons:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {service.add_ons.map((ao) => (
                            <span
                              key={ao.name}
                              className="px-2.5 py-1 rounded-md bg-[#FFF9F6] text-[#201817]/80 text-[11px] border border-[#F6E6E2]"
                            >
                              +{ao.name} ({formatCurrency(ao.price)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/book?service=${service.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-sm group-hover:shadow"
                  >
                    <span>Book This Treatment</span>
                    <ArrowRight className="w-4 h-4 text-[#EAA0A5]" />
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
