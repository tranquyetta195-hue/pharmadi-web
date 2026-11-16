'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuickOrderModal() {
  const { quickOrderProduct, setQuickOrderProduct, addToCart, setIsCartOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (quickOrderProduct) {
      setQty(quickOrderProduct.min_order_qty || 1);
      setIsSuccess(false);
    }
  }, [quickOrderProduct]);

  if (!quickOrderProduct) return null;

  const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

  const handleAddToCart = () => {
    addToCart(quickOrderProduct, qty);
    setIsSuccess(true);
    setTimeout(() => {
      setQuickOrderProduct(null);
    }, 1200);
  };

  const handleOrderNow = () => {
    addToCart(quickOrderProduct, qty);
    setQuickOrderProduct(null);
    setIsCartOpen(true);
  };

  const totalWholesale = quickOrderProduct.wholesale_price * qty;
  const totalOriginal = quickOrderProduct.original_price * qty;
  const saving = totalOriginal - totalWholesale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Nhập sỉ Dược Phẩm Chính Hãng
            </span>
          </div>
          <button
            onClick={() => setQuickOrderProduct(null)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-xl border border-slate-100 bg-white p-2 flex-shrink-0">
              <Image
                src={quickOrderProduct.thumbnail_url}
                alt={quickOrderProduct.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-sky-600 uppercase">
                {quickOrderProduct.brand_name}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {quickOrderProduct.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Quy cách: <strong className="text-slate-700">{quickOrderProduct.packaging}</strong> | SKU: {quickOrderProduct.sku}
              </p>
            </div>
          </div>

          {/* Giá & Chiết khấu */}
          <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Đơn giá sỉ nhà thuốc:</span>
              <span className="text-base font-extrabold text-sky-700">
                {formatPrice(quickOrderProduct.wholesale_price)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Giá niêm yết bán lẻ:</span>
              <span className="line-through">{formatPrice(quickOrderProduct.original_price)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-700 font-medium pt-1 border-t border-sky-200/50">
              <span>Tiết kiệm cho nhà thuốc:</span>
              <span>{formatPrice(quickOrderProduct.original_price - quickOrderProduct.wholesale_price)} / sp</span>
            </div>
          </div>

          {/* Bộ chọn số lượng */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-slate-800">Số lượng nhập sỉ:</span>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2.5 hover:bg-slate-100 text-slate-700 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-bold text-sm focus:outline-none"
              />
              <button
                onClick={() => setQty(qty + 1)}
                className="p-2.5 hover:bg-slate-100 text-slate-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tổng tiền tạm tính */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Tổng tiền nhập ({qty} hộp):</span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {formatPrice(totalWholesale)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 block">Lợi nhuận gộp tạm tính:</span>
              <span className="text-sm font-bold text-emerald-400">+{formatPrice(saving)}</span>
            </div>
          </div>

          {/* Cam kết hỗ trợ */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Đầy đủ hóa đơn VAT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>Giao hàng nhanh toàn quốc</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-gray-100 bg-slate-50 flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isSuccess}
            className="flex-1 py-3 px-4 rounded-xl border border-sky-600 text-sky-700 hover:bg-sky-50 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã thêm vào giỏ!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>
          <button
            onClick={handleOrderNow}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md transition"
          >
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
