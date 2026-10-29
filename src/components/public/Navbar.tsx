'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Search,
  Menu,
  X,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { SalonSettings } from '@/types';
import { getInitialData } from '@/lib/data-store';

interface NavbarProps {
  settings?: SalonSettings;
}

export function Navbar({ settings: initialSettings }: NavbarProps) {
  const [settings, setSettings] = useState<SalonSettings>(
    initialSettings || getInitialData().settings
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleUpdate = () => {
      const data = getInitialData();
      setSettings(data.settings);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('glama_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('glama_data_updated', handleUpdate);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top micro-bar for opening hours and phone */}
      <div className="bg-[#2D1B1A] text-[#FFF9F6]/80 text-xs py-2 px-4 sm:px-8 border-b border-[#FFF9F6]/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#EAA0A5]" />
              Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#EAA0A5]" />
              {settings.address}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 hover:text-[#EAA0A5] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#EAA0A5]" />
              {settings.phone}
            </a>
            <Link
              href="/admin"
              className="text-[#EAA0A5] hover:text-white transition-colors underline-offset-4 hover:underline text-[11px]"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF9F6]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#F6E6E2]'
            : 'bg-[#FFF9F6] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] group-hover:scale-105 transition-transform duration-300">
              {/* Stylized Floral Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-none stroke-current stroke-2"
              >
                <path d="M12 2C13.5 6 17 8 20 8.5C17 11 15 14 15 18C13.5 15 10.5 15 9 18C9 14 7 11 4 8.5C7 8 10.5 6 12 2Z" />
                <circle cx="12" cy="11" r="2.5" fill="#EAA0A5" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#201817] block leading-none">
                {settings.salon_name.split(' ')[0] || 'Glama'}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B96F73] font-medium block mt-0.5">
                Hair & Beauty Salon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-[#201817]'
                      : 'text-[#201817]/70 hover:text-[#B96F73]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAA0A5] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search services"
              className="p-2 text-[#201817]/80 hover:text-[#B96F73] transition-colors rounded-full hover:bg-[#F6E6E2]/50"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Book Appointment CTA Button */}
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F6E6E2] text-[#201817] text-sm font-medium hover:bg-[#ECC7C1] transition-all duration-200 shadow-sm hover:shadow"
            >
              <Calendar className="w-4 h-4 text-[#B96F73]" />
              <span>Book Appointment</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#201817] hover:text-[#B96F73] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-[#FFF9F6] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#F6E6E2]">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl text-[#201817]">
                    {settings.salon_name}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-base font-medium text-[#201817] hover:text-[#B96F73]"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#D8C6C0]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#F6E6E2] space-y-4">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#2D1B1A] text-white text-sm font-medium hover:bg-[#3D2524] transition-all shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#EAA0A5]" />
                Book Appointment
              </Link>

              <div className="text-xs text-center text-[#201817]/70 space-y-1">
                <p>{settings.phone}</p>
                <p>{settings.address}</p>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#B96F73] hover:underline"
                >
                  Salon Owner / Staff Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#F6E6E2]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F6E6E2]">
              <h3 className="font-serif text-xl text-[#201817]">Search Salon Services</h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="E.g., Haircut, Balayage, Facial, Bridal, Nails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9F6] border border-[#F6E6E2] rounded-xl text-sm focus:outline-none focus:border-[#EAA0A5]"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-gray-400 self-center">Popular:</span>
              {['Haircut', 'Balayage', 'Hydrating Facial', 'Russian Manicure', 'Bridal Makeup'].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/services?search=${encodeURIComponent(term)}`}
                    onClick={() => setSearchModalOpen(false)}
                    className="px-3 py-1 rounded-full bg-[#F6E6E2] text-[#201817] hover:bg-[#EAA0A5] hover:text-white transition-colors"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
