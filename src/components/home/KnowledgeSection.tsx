'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types';

interface KnowledgeSectionProps {
  posts: BlogPost[];
}

export default function KnowledgeSection({ posts }: KnowledgeSectionProps) {
  if (!posts || posts.length === 0) return null;

  const featured = posts[0];
  const restPosts = posts.slice(1, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <h3 className="text-xl font-bold text-slate-800">Tri thức Y Dược & Đào tạo</h3>
        </div>
        <Link
          href="/tri-thuc"
          className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 group"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bài viết nổi bật lớn nhất bên trái */}
        {featured && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <Link href={`/tri-thuc/${featured.slug}`} className="block relative aspect-video w-full overflow-hidden">
              <Image
                src={featured.featured_image}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-sky-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {featured.category_name}
              </span>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.author_name}</span>
                </div>

                <Link href={`/tri-thuc/${featured.slug}`}>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition leading-snug line-clamp-2">
                    {featured.title}
                  </h4>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3 h-3" /> Chuyên môn Dược
                </span>
                <Link
                  href={`/tri-thuc/${featured.slug}`}
                  className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
                >
                  Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách 3 bài nhỏ bên phải */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {restPosts.map((post) => (
            <Link
              key={post.id}
              href={`/tri-thuc/${post.slug}`}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition flex gap-3.5 group"
            >
              <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                    {post.title}
                  </h5>
                </div>
                <span className="text-[10px] text-sky-600 font-semibold truncate">
                  {post.category_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
