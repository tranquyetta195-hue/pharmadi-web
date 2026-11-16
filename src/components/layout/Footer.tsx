import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pb-20 md:pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
                D!
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                Pharma<span className="text-sky-600">Di</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Make Consumer Health Better</p>
            <h4 className="font-bold text-slate-800 text-base">Công ty cổ phần PharmaDi</h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>Trụ sở: 36 Mạc Đĩnh Chi, Phường Tân Định, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Miền Bắc: <strong className="text-slate-800">0399.769.265</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Miền Nam: <strong className="text-slate-800">0852.247.776</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>info@pharmadi.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Chính sách mua hàng */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-sm">Chính sách mua hàng</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-sky-600 transition">Chính sách đổi trả, hoàn tiền</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition">Chính sách thanh toán</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition">Chính sách vận chuyển</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition">Chính sách khiếu nại</Link></li>
            </ul>
          </div>

          {/* Cột 3: Giao dịch với PharmaDi */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-sm">Giao dịch với PharmaDi</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-sky-600 transition">Hướng dẫn đăng ký tài khoản</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link href="/tri-thuc" className="hover:text-sky-600 transition">Tri thức chuyên môn</Link></li>
              <li><Link href="#" className="hover:text-sky-600 transition">Tuyển dụng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối & Chứng nhận */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 text-sm">Kết nối với chúng tôi</h4>
            <div className="flex gap-2.5 mb-5">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90">
                f
              </span>
              <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90">
                Zalo
              </span>
              <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90">
                ▶
              </span>
            </div>

            {/* Logo Đã Thông Báo Bộ Công Thương */}
            <div className="inline-flex items-center gap-2 p-2 border border-blue-200 rounded-lg bg-blue-50/50">
              <ShieldCheck className="w-6 h-6 text-blue-700" />
              <div className="text-[10px] leading-tight font-bold text-blue-900">
                ĐÃ THÔNG BÁO<br />BỘ CÔNG THƯƠNG
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© Copyright PharmaDi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Nguồn hàng chính ngạch 100%
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Hóa đơn VAT đầy đủ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
