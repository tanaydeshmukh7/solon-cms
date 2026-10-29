'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { TrustStrip } from '@/components/public/TrustStrip';
import { ServicesGrid } from '@/components/public/ServicesGrid';
import { AboutSection } from '@/components/public/AboutSection';
import { TransformationsGallery } from '@/components/public/TransformationsGallery';
import { Testimonials } from '@/components/public/Testimonials';
import { AppointmentCTA } from '@/components/public/AppointmentCTA';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';
import { SalonDataState } from '@/lib/data-store';

export default function HomePage() {
  const [dataState, setDataState] = useState<SalonDataState>(getInitialData);

  useEffect(() => {
    const handleUpdate = () => {
      setDataState(getInitialData());
    };
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9F6] selection:bg-[#EAA0A5]/30">
      <Navbar settings={dataState.settings} />
      <Hero settings={dataState.settings} />
      <TrustStrip />
      <ServicesGrid categories={dataState.categories} />
      <AboutSection />
      <TransformationsGallery transformations={dataState.transformations} />
      <Testimonials testimonials={dataState.testimonials} />
      <AppointmentCTA settings={dataState.settings} />
      <Footer settings={dataState.settings} />
    </main>
  );
}
