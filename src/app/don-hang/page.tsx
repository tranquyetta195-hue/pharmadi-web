'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, Package, Clock, CheckCircle, Truck, Search, ShoppingBag } from 'lucide-react';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchPhone, setSearchPhone] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pharmadi_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Cannot read orders from localStorage', e);
    }
  }, []);

  const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">Hoàn tất</span>;
      case 'shipping':
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">Đang giao</span>;
      case 'confirmed':
        return <span className="bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full text-xs font-semibold">Đã xác nhận</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">Đang xử lý</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Quản Lý Đơn Hàng Sỉ</h1>
          <p className="text-xs text-gray-500">Theo dõi tiến độ giao hàng và thông tin các đơn hàng đã đặt</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-700">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Các đơn hàng bạn đặt qua hệ thống hoặc lưu trên thiết bị này sẽ được hiển thị chi tiết tại đây.
            </p>
          </div>
          <Link
            href="/#san-pham"
            className="inline-block px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
          >
            Bắt đầu nhập sỉ
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-gray-400 block">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-sky-700 text-sm">
                    {order.orderCode || 'PMD' + (idx + 100000)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Trạng thái:</span>
                  {getStatusBadge(order.status || 'pending')}
                </div>
              </div>

              {/* Thông tin giao hàng */}
              <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400">Người nhận:</span>{' '}
                  <strong className="text-slate-800">{order.customer_name}</strong>
                  {order.pharmacy_name && <span> ({order.pharmacy_name})</span>}
                </div>
                <div>
                  <span className="text-gray-400">SĐT:</span>{' '}
                  <strong className="text-slate-800">{order.phone}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400">Địa chỉ:</span> {order.address}
                </div>
              </div>

              {/* Danh sách mặt hàng */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-700 block">Sản phẩm:</span>
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs text-slate-600 py-1 border-b border-slate-50 last:border-none">
                    <span className="truncate max-w-[280px]">
                      {item.quantity}x {item.product_name} ({item.packaging})
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tổng thanh toán */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Phương thức: <strong className="uppercase">{order.payment_method || 'COD'}</strong>
                </span>
                <div className="text-right">
                  <span className="text-xs text-gray-400 mr-2">Tổng thanh toán:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
