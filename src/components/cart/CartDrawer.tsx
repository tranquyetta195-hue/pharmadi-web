'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, QrCode, Phone, Building } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { submitOrder } from '@/lib/supabase/service';
import { Order } from '@/types';

export default function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { profile } = useAuth();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');

  // Form checkout state (auto-fill from profile if logged in)
  const [formData, setFormData] = useState({
    customerName: profile?.full_name || '',
    pharmacyName: profile?.pharmacy_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    note: '',
    paymentMethod: 'vietqr' as 'cod' | 'vietqr' | 'consultation',
  });

  if (!isCartOpen) return null;

  const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ giao hàng');
      return;
    }

    setIsSubmitting(true);
    const orderPayload: Order = {
      customer_name: formData.customerName,
      pharmacy_name: formData.pharmacyName,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
      payment_method: formData.paymentMethod,
      total_amount: totalAmount,
      status: 'pending',
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        packaging: item.product.packaging,
        quantity: item.quantity,
        unit_price: item.product.wholesale_price,
      })),
    };

    const res = await submitOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      setCreatedOrderCode(res.orderCode);
      setStep('success');
      clearCart();
    } else {
      alert('Đặt hàng thất bại: ' + res.error);
    }
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    if (step === 'success') {
      setStep('cart');
    }
  };

  // Tạo URL mã VietQR động dựa trên tổng tiền và mã đơn
  const vietQrUrl = `https://img.vietqr.io/image/970422-0852247776-compact2.png?amount=${totalAmount}&addInfo=PHARMADI%20${createdOrderCode || 'ORDER'}&accountName=CONG%20TY%20CP%20PHARMADI`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header Drawer */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-800">
                {step === 'cart' && `Đơn hàng sỉ (${totalItems} sản phẩm)`}
                {step === 'checkout' && 'Xác nhận đơn hàng nhà thuốc'}
                {step === 'success' && 'Đặt hàng thành công!'}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-gray-400 hover:text-slate-700 rounded-lg hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* STEP 1: Danh sách sản phẩm trong giỏ */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-base">Giỏ hàng sỉ đang trống</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Hãy chọn các sản phẩm dược phẩm chính hãng với giá sỉ tốt nhất để nhập hàng.
                      </p>
                    </div>
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
                    >
                      Khám phá sản phẩm
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex gap-3 items-center"
                      >
                        <div className="relative w-16 h-16 rounded-lg border border-slate-100 bg-white p-1 flex-shrink-0">
                          <Image
                            src={item.product.thumbnail_url}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-sky-600 uppercase block truncate">
                            {item.product.brand_name}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-800 truncate" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {formatPrice(item.product.wholesale_price)}
                            </span>
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-slate-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-slate-600 hover:bg-slate-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-slate-600 hover:bg-slate-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: Form thông tin nhà thuốc & Thanh toán */}
            {step === 'checkout' && (
              <form id="orderForm" onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <span className="font-bold text-sky-900 block mb-1">Đơn đặt sỉ dược phẩm</span>
                  <span className="text-sky-700">
                    {totalItems} sản phẩm • Tổng tiền:{' '}
                    <strong className="text-slate-900">{formatPrice(totalAmount)}</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Họ tên người nhận / Dược sĩ phụ trách *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="vd: Dược sĩ Nguyễn Văn An"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tên Nhà thuốc / Quầy thuốc / Shop
                    </label>
                    <input
                      type="text"
                      value={formData.pharmacyName}
                      onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                      placeholder="vd: Nhà thuốc An Khang Đạt Chuẩn GPP"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="vd: 0908123456"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Địa chỉ nhận hàng (kèm Quận/Huyện, Tỉnh/TP) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh thành..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ghi chú thêm (yêu cầu xuất VAT, hẹn giờ giao...)
                    </label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ghi chú thêm nếu có..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Hình thức thanh toán B2B:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'vietqr'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'vietqr' })}
                        />
                        <div className="flex-1">
                          <span className="font-bold text-slate-800 block">Chuyển khoản VietQR (Khuyên dùng)</span>
                          <span className="text-gray-400 text-[11px]">Quét mã QR tự động điền số tiền và nội dung đơn</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        />
                        <div className="flex-1">
                          <span className="font-bold text-slate-800 block">Thanh toán khi nhận hàng (COD)</span>
                          <span className="text-gray-400 text-[11px]">Kiểm tra hàng trước khi thanh toán cho shipper</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'consultation'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'consultation' })}
                        />
                        <div className="flex-1">
                          <span className="font-bold text-slate-800 block">Nhân viên liên hệ báo giá & hợp đồng</span>
                          <span className="text-gray-400 text-[11px]">Hỗ trợ công nợ và chiết khấu đặc biệt cho chuỗi</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: Xác nhận thành công & VietQR */}
            {step === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Đặt hàng thành công!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Mã đơn hàng: <strong className="text-sky-600 font-mono text-sm">{createdOrderCode}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Đơn hàng đã được lưu vào hệ thống cơ sở dữ liệu Supabase. Chuyên viên PharmaDi sẽ liên hệ xác nhận trong vòng 15 phút.
                  </p>
                </div>

                {formData.paymentMethod === 'vietqr' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">
                      Quét mã VietQR để thanh toán:
                    </span>
                    <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-xl border shadow-sm">
                      <Image
                        src={vietQrUrl}
                        alt="Mã VietQR PharmaDi"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="text-[11px] text-gray-600 space-y-1">
                      <p>Ngân hàng: <strong>MBBank</strong> | STK: <strong>0852247776</strong></p>
                      <p>Chủ TK: <strong>CONG TY CP PHARMADI</strong></p>
                      <p>Nội dung CK: <strong className="text-sky-600">PHARMADI {createdOrderCode}</strong></p>
                    </div>
                  </div>
                )}

                <button
                  onClick={closeDrawer}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Hoàn tất và tiếp tục mua hàng
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {cart.length > 0 && step !== 'success' && (
            <div className="p-4 border-t border-gray-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tổng thanh toán:</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                >
                  <span>Tiến hành đặt hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    form="orderForm"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Đang gửi đơn hàng...' : 'Xác nhận tạo đơn'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
