'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { getInitialData } from '@/lib/data-store';
import { formatDate } from '@/lib/utils';

export default function BlogPostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const data = getInitialData();
  const post =
    data.blogPosts.find((p) => p.slug === resolvedParams.slug) ||
    data.blogPosts[0];

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col justify-between">
      <Navbar settings={data.settings} />

      <main className="flex-1 py-12 sm:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#B96F73] hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#F6E6E2] text-[#B96F73] text-xs font-semibold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#201817] leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 py-6 border-y border-[#F6E6E2] my-8 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#B96F73]" />
              {post.author_name}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B96F73]" />
              {formatDate(post.published_at.split('T')[0])}
            </span>
          </div>

          {post.cover_image && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl mb-10 bg-[#F6E6E2]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-stone max-w-none text-[#201817]/85 text-base sm:text-lg leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-14 p-8 rounded-3xl bg-[#2D1B1A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="font-serif text-2xl font-medium">Ready for Your Transformation?</h3>
              <p className="text-xs text-white/70 mt-1">Book your tailored beauty session with our experts today.</p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EAA0A5] text-[#201817] text-xs font-semibold hover:bg-white transition-colors shrink-0"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>

      <Footer settings={data.settings} />
    </div>
  );
}
