'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, Zap, ClipboardList, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();
  const { setIsCartOpen, totalItems } = useCart();

  const navItems = [
    {
      label: 'Trang chủ',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Khuyến mãi',
      href: '/#khuyen-mai',
      icon: Tag,
      isActive: pathname === '/khuyen-mai',
    },
    {
      label: 'Đặt nhanh',
      onClick: () => setIsCartOpen(true),
      icon: Zap,
      badge: totalItems > 0 ? totalItems : null,
      isActive: false,
    },
    {
      label: 'Đơn hàng',
      href: '/don-hang',
      icon: ClipboardList,
      isActive: pathname === '/don-hang',
    },
    {
      label: 'Tài khoản',
      onClick: user ? undefined : () => openAuthModal('login'),
      href: user ? '/tai-khoan' : undefined,
      icon: User,
      isActive: pathname === '/tai-khoan',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="relative flex flex-col items-center justify-center py-1 px-2 text-center group">
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition ${
                    item.isActive ? 'text-sky-600 scale-110' : 'text-slate-500 group-hover:text-sky-600'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  item.isActive ? 'text-sky-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button key={idx} onClick={item.onClick} className="flex-1 focus:outline-none">
                {content}
              </button>
            );
          }

          return (
            <Link key={idx} href={item.href || '/'} className="flex-1 focus:outline-none">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
