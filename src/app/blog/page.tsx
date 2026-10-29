'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';
import { formatDate } from '@/lib/utils';

export default function BlogPage() {
  const data = getInitialData();

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B96F73] block">
              THE BEAUTY JOURNAL
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] tracking-tight mt-1">
              Editorial Guides &amp; Insights
            </h1>
            <p className="text-sm sm:text-base text-[#201817]/70 mt-2">
              Pro tips, salon maintenance rituals, and trend forecasts written by our resident specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {data.blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#F6E6E2] shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F6E6E2]">
                    <Image
                      src={post.cover_image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-[#F6E6E2] text-[#B96F73] text-[10px] font-semibold uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-serif text-2xl font-semibold text-[#201817] group-hover:text-[#B96F73] transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#201817]/70 mt-3 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-[#F6E6E2]/50 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#B96F73]" />
                    <span>{post.author_name}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#201817] hover:text-[#B96F73]"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
