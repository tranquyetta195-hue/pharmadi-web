import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import QuickOrderModal from '@/components/product/QuickOrderModal';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthModal from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'PharmaDi - Nền tảng phân phối sỉ thực phẩm chức năng & Dược phẩm chính hãng',
  description:
    'PharmaDi là nền tảng nhập sỉ 40+ thương hiệu TPCN chính hãng cho 10.000+ nhà thuốc, shop toàn quốc, chiết khấu tốt, giao hàng nhanh.',
  keywords: [
    'pharmadi',
    'nhập sỉ thực phẩm chức năng',
    'nguồn hàng thực phẩm chức năng',
    'giá sỉ nhà thuốc',
    'nhà phân phối dược phẩm',
    'sỉ TPCN chính hãng',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
            <QuickOrderModal />
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
