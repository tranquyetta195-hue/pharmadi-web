'use client';

import React from 'react';
import Link from 'next/link';
import { User, Building, Phone, MapPin, Award, ShieldCheck, LogOut, Package, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, profile, signOut, openAuthModal, demoLoginAsPharmacy } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Tài Khoản Nhà Thuốc</h2>
        <p className="text-xs text-gray-500">
          Vui lòng đăng nhập hoặc đăng ký tài khoản để xem thông tin tích lũy, quản lý đơn hàng và lưu địa chỉ giao sỉ.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
          >
            Đăng nhập ngay
          </button>
          <button
            onClick={demoLoginAsPharmacy}
            className="w-full py-3 rounded-xl border border-dashed border-sky-400 bg-sky-50 text-sky-800 font-bold text-xs transition"
          >
            Đăng nhập nhanh (Tài khoản Nhà thuốc Mẫu)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-sky-500/20">
            {profile?.pharmacy_name ? profile.pharmacy_name.charAt(0) : 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-extrabold text-slate-800">
                {profile?.pharmacy_name || 'Nhà thuốc đối tác'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Đã xác thực GPP
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Dược sĩ phụ trách: <strong className="text-slate-700">{profile?.full_name || 'Dược sĩ'}</strong> • {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Thẻ Thống kê điểm tích lũy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-sm">
          <span className="text-xs text-amber-100 block font-medium">Điểm Tích Lũy Nhà Thuốc</span>
          <span className="text-2xl font-black tracking-tight mt-1 block">12.500 điểm</span>
          <span className="text-[11px] text-amber-200 mt-2 block">Quy đổi tương đương: 125.000đ trừ đơn kế tiếp</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs text-gray-400 block font-medium">Hạng thành viên B2B</span>
          <span className="text-xl font-black text-slate-800 tracking-tight mt-1 block">Hạng Vàng (Gold)</span>
          <span className="text-[11px] text-emerald-600 mt-2 block font-semibold">Ưu đãi: Miễn phí vận chuyển toàn quốc</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-xs text-gray-400 block font-medium">Đơn hàng đã nhập</span>
          <Link href="/don-hang" className="text-xl font-black text-sky-600 hover:underline tracking-tight mt-1 block">
            Xem lịch sử đơn →
          </Link>
          <span className="text-[11px] text-gray-400 mt-2 block">Hỗ trợ xuất hóa đơn VAT điện tử</span>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-base border-b pb-3">Hồ sơ pháp lý Nhà thuốc</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Tên cơ sở kinh doanh:</span>
            <span className="font-semibold text-slate-800 text-sm">
              {profile?.pharmacy_name || 'Nhà Thuốc An Khang - GPP'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Số chứng chỉ hành nghề / Giấy GPP:</span>
            <span className="font-mono font-semibold text-slate-800 text-sm">
              {profile?.gpp_number || 'GPP-HCM-2024/09812'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Số điện thoại liên hệ:</span>
            <span className="font-semibold text-slate-800 text-sm">
              {profile?.phone || '0908123456'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Địa chỉ giao hàng mặc định:</span>
            <span className="font-semibold text-slate-800 text-sm">
              {profile?.address || '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
