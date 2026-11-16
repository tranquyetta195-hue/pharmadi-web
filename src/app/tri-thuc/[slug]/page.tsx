import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/wordpress/client';
import { Calendar, User, ArrowLeft, Share2, Tag, ShieldCheck } from 'lucide-react';

interface BlogPostDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: 'Bài viết không tìm thấy - PharmaDi' };
  }
  return {
    title: `${post.title} - PharmaDi Tri Thức`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb / Back button */}
      <Link
        href="/tri-thuc"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh mục Tri thức</span>
      </Link>

      {/* Header */}
      <div className="space-y-4 mb-6">
        <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full">
          {post.category_name}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-gray-500 py-3 border-y border-slate-100 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-4 h-4 text-sky-600" />
            <span>Tác giả: {post.author_name}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ngày đăng: {post.date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Đã kiểm duyệt chuyên môn</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-slate-200 shadow-md">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Post Content */}
      <div
        className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer of article */}
      <div className="mt-12 p-6 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Bạn là Dược sĩ hoặc Chủ quầy thuốc?</h4>
          <p className="text-xs text-gray-600 mt-0.5">
            Đăng ký tài khoản để nhận báo giá sỉ tốt nhất và tham gia các buổi đào tạo chuyên môn định kỳ.
          </p>
        </div>
        <Link
          href="/#san-pham"
          className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition whitespace-nowrap"
        >
          Xem danh mục sản phẩm
        </Link>
      </div>
    </article>
  );
}
