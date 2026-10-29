'use client';

import React from 'react';
import { Gem, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export function TrustStrip() {
  const benefits = [
    {
      icon: Gem,
      title: 'Premium Products',
      description: 'High-quality & trusted brands',
    },
    {
      icon: HeartHandshake,
      title: 'Expert Stylists',
      description: 'Certified & experienced',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic & Safe',
      description: 'Clean & comfortable environment',
    },
    {
      icon: Sparkles,
      title: 'Relaxing Atmosphere',
      description: 'Unwind & feel refreshed',
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-12 border-y border-[#F6E6E2]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] hover:border-[#EAA0A5]/60 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-13 h-13 rounded-full bg-[#F6E6E2] flex items-center justify-center shrink-0 text-[#B96F73]">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#201817] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#201817]/70 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
