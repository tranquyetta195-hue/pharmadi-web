'use client';

import React from 'react';
import { Check, ShieldCheck, TrendingDown, Zap, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function HeroBanner() {
  const { setIsCartOpen } = useCart();

  return (
    <section className="w-full">
      {/* Hero Big Banner Slider Container */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl mx-4 lg:mx-auto max-w-7xl mt-4 shadow-xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Content Left */}
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <span>PharmaDi × Genacol Canada</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Thương hiệu hỗ trợ xương khớp <span className="text-amber-400">#1 CANADA</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Giải pháp Collagen AminoLock® độc quyền hỗ trợ chăm sóc tái tạo khớp toàn diện. Chiết khấu cao cho nhà thuốc, nguồn hàng chuẩn nhập khẩu có hóa đơn VAT.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="#san-pham"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 text-base tracking-wide"
              >
                NHẬP SỈ NGAY!
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-slate-600 hover:border-slate-400 text-white font-semibold text-sm transition hover:bg-white/5"
              >
                Xem báo giá nhanh
              </button>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              * Nguồn: NielsenIQ - Báo cáo doanh số tại chuỗi nhà thuốc & bán lẻ hàng đầu Canada
            </p>
          </div>

          {/* Product visuals right */}
          <div className="relative flex items-center justify-center w-full md:w-auto">
            <div className="relative flex items-center gap-2 sm:gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-amber-400 font-extrabold text-2xl sm:text-3xl">40+</div>
                <div className="text-[11px] text-slate-300 font-medium">Thương hiệu quốc tế</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-sky-400 font-extrabold text-2xl sm:text-3xl">10.000+</div>
                <div className="text-[11px] text-slate-300 font-medium">Nhà thuốc tin dùng</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <div className="text-emerald-400 font-extrabold text-2xl sm:text-3xl">100%</div>
                <div className="text-[11px] text-slate-300 font-medium">Chính hãng có VAT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slogan & 4 Cam kết cốt lõi */}
      <div className="max-w-5xl mx-auto px-4 mt-8 text-center">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
          Nền tảng cung ứng dược phẩm được hơn <span className="text-sky-600">10.000 nhà thuốc/shop online</span> tin dùng
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>Hàng chính hãng</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
            <span>Giá nhập cạnh tranh</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span>Đặt hàng nhanh</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </span>
            <span>Giao nhanh toàn quốc</span>
          </div>
        </div>
      </div>
    </section>
  );
}
