'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Phone, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile, openAuthModal, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      {/* Topbar: Thông tin hotline hai miền */}
      <div className="bg-slate-50 border-b border-gray-100 text-xs text-gray-500 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Nền tảng cung ứng dược phẩm cho 10.000+ nhà thuốc & shop toàn quốc
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:0399769265" className="hover:text-sky-600 flex items-center gap-1 transition">
              <Phone className="w-3 h-3 text-sky-600" />
              <span>Miền Bắc: <strong className="text-gray-700">0399.769.265</strong></span>
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:0852247776" className="hover:text-sky-600 flex items-center gap-1 transition">
              <Phone className="w-3 h-3 text-sky-600" />
              <span>Miền Nam: <strong className="text-gray-700">0852.247.776</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
            D!
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">
              Pharma<span className="text-sky-600">Di</span>
            </span>
            <span className="text-[10px] text-gray-400 -mt-1 tracking-wider uppercase font-semibold">
              Make Consumer Health Better
            </span>
          </div>
        </Link>

        {/* Live Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, hoạt chất, thương hiệu..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm transition bg-gray-50 focus:bg-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Tri Thức (Blog) Link */}
          <Link
            href="/tri-thuc"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Tri thức Dược</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-full transition"
            title="Giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-sm">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/tai-khoan"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/50 hover:bg-sky-100/50 transition text-sm text-sky-800 font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold">
                  {profile?.pharmacy_name ? profile.pharmacy_name.charAt(0) : 'D'}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">
                  {profile?.pharmacy_name || profile?.full_name || 'Tài khoản'}
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 border border-gray-200 hover:border-sky-300 rounded-lg transition hover:bg-sky-50/50"
            >
              <User className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
