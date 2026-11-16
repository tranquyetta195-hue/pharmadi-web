'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Info, Package, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setQuickOrderProduct, addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = () => {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const formatPrice = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top bar: Brand + Wishlist */}
      <div className="p-3.5 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 truncate max-w-[180px]">
          <Package className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <span className="uppercase truncate">{product.brand_name}</span>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="text-gray-300 hover:text-red-500 transition focus:outline-none"
          title="Yêu thích"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Image container with TÍCH LŨY badge */}
      <div className="relative w-full aspect-square p-4 flex items-center justify-center bg-white cursor-pointer"
        onClick={() => setQuickOrderProduct(product)}
      >
        <div className="relative w-full h-full transform group-hover:scale-105 transition duration-300">
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
        </div>

        {/* Badge Tích Lũy */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
            {product.badge || 'TÍCH LŨY'}
          </span>
        </div>
      </div>

      {/* Info & Pricing */}
      <div className="p-3.5 pt-2 flex flex-col flex-1 justify-between">
        <div>
          <h4
            onClick={() => setQuickOrderProduct(product)}
            className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 hover:text-sky-600 cursor-pointer transition min-h-[36px]"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Pricing section */}
          <div className="mt-3 space-y-0.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span>Giá sỉ tốt nhất</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {formatPrice(product.wholesale_price)}
            </div>
            <div className="text-xs text-slate-400">
              Giá niêm yết: <span className="line-through">{formatPrice(product.original_price)}</span>
            </div>
          </div>
        </div>

        {/* Action Button: Nhập sỉ */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => setQuickOrderProduct(product)}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/60 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold transition text-center"
          >
            Nhập sỉ
          </button>
          <button
            onClick={handleQuickAdd}
            className={`px-3 py-2 rounded-xl transition text-xs font-semibold ${
              justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
            title="Thêm nhanh 1 sản phẩm"
          >
            {justAdded ? <Check className="w-4 h-4" /> : '+1'}
          </button>
        </div>
      </div>
    </div>
  );
}
