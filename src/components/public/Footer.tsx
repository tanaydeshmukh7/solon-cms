'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
} from 'lucide-react';
import { SalonSettings } from '@/types';
import { initialSalonSettings } from '@/lib/mock-data';

interface FooterProps {
  settings?: SalonSettings;
}

export function Footer({ settings: propSettings }: FooterProps) {
  const settings = propSettings || initialSalonSettings;

  return (
    <footer className="bg-[#1A0F0E] text-white/80 pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#F6E6E2]/15 flex items-center justify-center text-[#EAA0A5]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-none stroke-current stroke-2"
                >
                  <path d="M12 2C13.5 6 17 8 20 8.5C17 11 15 14 15 18C13.5 15 10.5 15 9 18C9 14 7 11 4 8.5C7 8 10.5 6 12 2Z" />
                  <circle cx="12" cy="11" r="2.5" fill="#EAA0A5" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-3xl font-medium tracking-tight text-white block leading-none">
                  {settings.salon_name.split(' ')[0] || 'Glama'}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#EAA0A5] font-medium block mt-0.5">
                  Hair &amp; Beauty Salon
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              {settings.tagline || 'Beauty. Care. Confidence.'}
              <br />
              Personalized luxury hair, skincare, and beauty transformations in a relaxing haven.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#EAA0A5] hover:text-[#201817] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#EAA0A5] hover:text-[#201817] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#EAA0A5] hover:text-[#201817] transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li>
                <Link href="/" className="hover:text-[#EAA0A5] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#EAA0A5] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#EAA0A5] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#EAA0A5] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#EAA0A5] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#EAA0A5] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#EAA0A5] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li>
                <Link
                  href="/services?category=hair-services"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Hair Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=skin-care"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Skin Care
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=makeup"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Makeup
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=nail-care"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Nail Care
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=beauty-treatments"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Beauty Treatments
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=bridal-packages"
                  className="hover:text-[#EAA0A5] transition-colors"
                >
                  Bridal Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Contact Info
            </h4>
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EAA0A5] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EAA0A5] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EAA0A5] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#EAA0A5] shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM – 8:00 PM</p>
                  <p className="mt-0.5 text-white/45">Sunday: 10:00 AM – 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} {settings.salon_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#EAA0A5] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#EAA0A5] transition-colors">
              Booking &amp; Cancellation Policy
            </Link>
            <Link href="/admin" className="text-[#EAA0A5] hover:underline">
              Owner / Staff CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
