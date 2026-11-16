'use client';

import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface BrandGridProps {
  onSelectBrand?: (brandName: string) => void;
  selectedBrand?: string | null;
}

const BRANDS = [
  { name: 'CODEAGE', origin: 'Mỹ', slogan: 'Dinh dưỡng tế bào' },
  { name: 'VITABIOTICS', origin: 'Anh', slogan: 'Science of healthy living' },
  { name: 'SOLGAR', origin: 'Mỹ', slogan: 'Từ 1947' },
  { name: 'WEBBER NATURALS', origin: 'Canada', slogan: 'Thảo dược tự nhiên' },
  { name: 'NORDIC NATURALS', origin: 'Mỹ', slogan: 'Omega-3 tinh khiết' },
  { name: 'HERBS OF GOLD', origin: 'Úc', slogan: 'Tiêu chuẩn TGA' },
  { name: 'OPTIBAC', origin: 'Anh', slogan: 'Lợi khuẩn hàng đầu' },
  { name: 'BLACKMORES', origin: 'Úc', slogan: 'Thương hiệu số 1 Úc' },
  { name: 'DHC', origin: 'Nhật Bản', slogan: 'Làm đẹp & Sức khỏe' },
  { name: "NATURE'S WAY", origin: 'Úc', slogan: 'Kids Smart số 1' },
  { name: 'SOLVITALE', origin: 'Châu Âu', slogan: 'Magnefol khoáng chất' },
  { name: 'SWISSE', origin: 'Úc', slogan: 'Thực phẩm vàng' },
  { name: 'ARKO PHARMA', origin: 'Pháp', slogan: 'Dược liệu thiên nhiên' },
  { name: 'HEALTHY CARE', origin: 'Úc', slogan: 'Gia đình khỏe mạnh' },
  { name: 'ORIHIRO', origin: 'Nhật Bản', slogan: 'Bổ não & Sụn vi cá' },
  { name: 'NEUBRIA', origin: 'Anh', slogan: 'Mind + Body' },
];

export default function BrandGrid({ onSelectBrand, selectedBrand }: BrandGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-sky-600" />
          <h3 className="text-xl font-bold text-slate-800">Thương hiệu nổi bật</h3>
        </div>
        {selectedBrand && (
          <button
            onClick={() => onSelectBrand?.('')}
            className="text-xs text-sky-600 hover:underline font-medium"
          >
            Xem tất cả thương hiệu
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {BRANDS.map((brand, idx) => {
          const isSelected = selectedBrand?.toLowerCase() === brand.name.toLowerCase();
          return (
            <button
              key={idx}
              onClick={() => onSelectBrand?.(brand.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition group bg-white ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-200 shadow-md bg-sky-50/30'
                  : 'border-slate-200/80 hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-800 group-hover:text-sky-600 transition">
                {brand.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">{brand.origin}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
