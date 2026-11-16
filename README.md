# PharmaDi B2B - Nền Tảng Phân Phối Sỉ Dược Phẩm & TPCN Chính Hãng

Hệ thống thương mại điện tử B2B dành riêng cho nhà thuốc, quầy thuốc và đại lý TPCN, xây dựng theo kiến trúc hiện đại chuẩn **Headless Commerce**:
- **Frontend:** Next.js 14+ (App Router, Server-Side Rendering, ISR, Responsive Mobile-First, Tailwind CSS).
- **Authentication & Database:** [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, Auth OTP/Password).
- **Headless CMS Blog:** [WordPress REST API](https://developer.wordpress.org/rest-api/) cho mục Tri thức & Đào tạo chuyên môn.
- **Thanh toán B2B:** Chuyển khoản ngân hàng tự động với mã chuẩn **VietQR** & COD.
- **CI/CD & Hosting:** GitHub + [Vercel](https://vercel.com).

---

## 🚀 1. Hướng Dẫn Khởi Chạy Dự Án Cục Bộ (Local Development)

### Bước 1: Cài đặt thư viện
```bash
npm install
```

### Bước 2: Chạy máy chủ phát triển
```bash
npm run dev
```
Truy cập trình duyệt tại: **http://localhost:3000**

---

## 🗄️ 2. Hướng Dẫn Cấu Hình Supabase (Database & Auth)

1. Đăng ký tài khoản miễn phí tại [supabase.com](https://supabase.com) và tạo một Project mới (chọn region gần nhất: **Singapore**).
2. Vào mục **SQL Editor** trong trang quản trị Supabase.
3. Mở file [supabase/schema.sql](file:///c:/Users/admin/Desktop/website/supabase/schema.sql) trong thư mục dự án này, copy toàn bộ nội dung và bấm **Run** để khởi tạo các bảng:
   - `profiles` (Hồ sơ nhà thuốc, số GPP)
   - `brands` (Thương hiệu quốc tế)
   - `categories` (Thành phần & Nhóm công dụng)
   - `products` (Sản phẩm, giá sỉ, giá niêm yết, tích lũy)
   - `orders` & `order_items` (Đơn đặt hàng)
4. Vào **Project Settings -> API**, copy 2 thông số:
   - `Project URL`
   - `anon public key`
5. Dán vào file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📝 3. Hướng Dẫn Quản Trị Viết Bài Bằng WordPress (Headless Blog)

Hệ thống được thiết kế theo kiến trúc **Headless Decoupled**:
- Nhân viên nội dung, dược sĩ viết và đăng bài trên trang quản trị WordPress Gutenberg quen thuộc.
- Next.js tự động nạp dữ liệu bài viết qua **WP REST API** và hiển thị tại route `/tri-thuc` với tốc độ tải trang chỉ **0.1 giây** nhờ bộ nhớ đệm ISR.

### Cách kết nối:
1. Bạn có thể sử dụng bất kỳ hosting WordPress nào (hoặc tạo trang miễn phí trên WordPress.com).
2. Trong WordPress, bạn chỉ cần viết bài bình thường trong mục **Posts (Bài viết)**, đặt ảnh đại diện (Featured Image) và chuyên mục.
3. Mở `.env.local` và điền địa chỉ website WordPress của bạn:
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.yourdomain.com
   ```
*(Lưu ý: Nếu chưa có website WordPress, hệ thống đã tích hợp sẵn Mock Data chuyên môn hoàn chỉnh để bạn xem thử và kiểm thử giao diện).*

---

## 🌐 4. Hướng Dẫn Đẩy Lên GitHub & Deploy Lên Vercel

### Bước 1: Khởi tạo Git & Đẩy code lên GitHub
```bash
git init
git add .
git commit -m "feat: initial pharmadi b2b platform"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

### Bước 2: Deploy lên Vercel
1. Đăng nhập [vercel.com](https://vercel.com) (chọn **Continue with GitHub**).
2. Bấm **Add New... -> Project**.
3. Chọn Repository GitHub vừa tạo và bấm **Import**.
4. Trong mục **Environment Variables**, điền các biến môi trường từ `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WORDPRESS_API_URL`
5. Bấm **Deploy**. Vercel sẽ tự động build và cấp cho bạn một domain `.vercel.app` tốc độ cao với chứng chỉ SSL miễn phí!
