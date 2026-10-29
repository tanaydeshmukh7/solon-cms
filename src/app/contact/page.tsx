'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';

export default function ContactPage() {
  const data = getInitialData();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              WE ARE HERE FOR YOU
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              Visit or Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-[#201817]/70 mt-2">
              Have questions regarding bridal styling, bespoke hair color, or salon directions? Reach out anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#F6E6E2] shadow-sm space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#201817]">
                  Glama Studio New York
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Located in the heart of the luxury beauty district.
                </p>
              </div>

              <div className="space-y-6 text-sm text-[#201817]/85">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                      Address
                    </h4>
                    <p className="text-sm mt-0.5">{data.settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                      Telephone
                    </h4>
                    <a href={`tel:${data.settings.phone}`} className="text-sm mt-0.5 hover:text-[#B96F73] block">
                      {data.settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                      Email Concierge
                    </h4>
                    <a href={`mailto:${data.settings.email}`} className="text-sm mt-0.5 hover:text-[#B96F73] block">
                      {data.settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F6E6E2] flex items-center justify-center text-[#B96F73] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                      Operating Hours
                    </h4>
                    <p className="text-sm mt-0.5">Mon - Sat: 9:00 AM – 8:00 PM</p>
                    <p className="text-xs text-gray-500">Sunday: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-4 border-t border-[#F6E6E2]">
                <a
                  href={`https://wa.me/${data.settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Message Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#F6E6E2] shadow-sm">
              <h3 className="font-serif text-2xl font-semibold text-[#201817] mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Our reception team will reply within 2 business hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-xl font-semibold">Thank You!</h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Your message has been received. Our concierge will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                        placeholder="Sophia Loren"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                      placeholder="sophia@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#201817] uppercase tracking-wider mb-1.5">
                      How can we assist you? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8C6C0] text-sm focus:outline-none focus:border-[#B96F73]"
                      placeholder="Tell us about the services you're interested in, preferred dates, or special event details..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#2D1B1A] text-white text-xs font-semibold hover:bg-[#3D2524] transition-all shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#EAA0A5]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
