import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import { getBlogPosts } from '@/lib/wordpress/client';

export const metadata = {
  title: 'Tri thức Y Dược & Đào tạo chuyên môn - PharmaDi',
  description: 'Tổng hợp các bài viết chuyên môn dinh dưỡng, đào tạo dược sĩ và chuyển giao giải pháp TPCN chính hãng.',
};

export default async function KnowledgePage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Góc Chuyên Môn & Đào Tạo Dược Sĩ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Tri Thức & Tin Tức Y Dược</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
          Cập nhật kiến thức hoạt chất, phác đồ tư vấn tại quầy thuốc và các chương trình đào tạo liên tục cùng các chuyên gia, bác sĩ đầu ngành.
        </p>
      </div>

      {/* Grid bài viết */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <Link href={`/tri-thuc/${post.slug}`} className="block relative aspect-video w-full overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                {post.category_name}
              </span>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="truncate">{post.author_name}</span>
                </div>

                <Link href={`/tri-thuc/${post.slug}`}>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Chuyên môn
                </span>
                <Link
                  href={`/tri-thuc/${post.slug}`}
                  className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
                >
                  Đọc bài viết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
