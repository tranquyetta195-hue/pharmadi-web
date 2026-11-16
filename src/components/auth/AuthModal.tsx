'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Phone, Building2, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, signInWithEmail, signUpWithEmail, demoLoginAsPharmacy } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(authModalMode || 'login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (tab === 'login') {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (res?.error) {
        setErrorMsg('Đăng nhập thất bại: ' + res.error);
      }
    } else {
      const res = await signUpWithEmail({
        email,
        password,
        fullName,
        phone,
        pharmacyName,
      });
      setLoading(false);
      if (res?.error) {
        setErrorMsg('Đăng ký thất bại: ' + res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Header Modal */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
              D!
            </div>
            <span className="font-extrabold text-slate-800 text-sm">Cổng Đăng Nhập PharmaDi</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-gray-400 hover:text-slate-700 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 mx-5 mt-5 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${
              tab === 'login' ? 'bg-white text-sky-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${
              tab === 'register' ? 'bg-white text-sky-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Đăng ký Nhà thuốc
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên Dược sĩ / Chủ quầy *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dược sĩ Nguyễn Văn An"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên Nhà thuốc / Quầy thuốc *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      placeholder="Nhà thuốc An Khang GPP"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0908123456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhathuoc@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mật khẩu *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition text-xs sm:text-sm mt-2"
            >
              {loading
                ? 'Đang xử lý...'
                : tab === 'login'
                ? 'Đăng nhập vào hệ thống'
                : 'Tạo tài khoản Nhà thuốc'}
            </button>
          </form>

          {/* Quick Demo Login button */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={demoLoginAsPharmacy}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-sky-400 bg-sky-50/60 hover:bg-sky-100/60 text-sky-800 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Đăng nhập thử 1-click (Tài khoản Nhà Thuốc Mẫu)</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Bảo mật bởi Supabase Authentication & PostgreSQL Row Level Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
