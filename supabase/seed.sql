-- ========================================================
-- PHARMADI B2B - TOÀN BỘ SCHEMA VÀ DỮ LIỆU MẪU (SEED DATA)
-- Copy toàn bộ file này dán vào Supabase -> SQL Editor -> Bấm RUN
-- ========================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG / NHÀ THUỐC
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT UNIQUE,
  pharmacy_name TEXT,
  gpp_license_number TEXT,
  address TEXT,
  province TEXT,
  district TEXT,
  ward TEXT,
  is_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG THƯƠNG HIỆU (BRANDS)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  country TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG DANH MỤC / NHÓM CÔNG DỤNG & HOẠT CHẤT (CATEGORIES)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ingredient', 'function', 'general')),
  icon_url TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG SẢN PHẨM (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  summary TEXT,
  description TEXT,
  original_price NUMERIC(12, 0) NOT NULL,
  wholesale_price NUMERIC(12, 0) NOT NULL,
  reward_points NUMERIC(12, 0) DEFAULT 0,
  packaging TEXT NOT NULL,
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_in_stock BOOLEAN DEFAULT true,
  badge TEXT DEFAULT 'TÍCH LŨY',
  min_order_qty INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG THANG GIÁ SỈ THEO SỐ LƯỢNG (PRODUCT_TIER_PRICES)
CREATE TABLE IF NOT EXISTS public.product_tier_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity INT NOT NULL CHECK (min_quantity > 0),
  unit_price NUMERIC(12, 0) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  pharmacy_name TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  province TEXT,
  note TEXT,
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'vietqr', 'consultation')),
  total_amount NUMERIC(14, 0) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  packaging TEXT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 0) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tier_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- CÁC CHÍNH SÁCH BẢO MẬT (POLICIES)
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read brands" ON public.brands;
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read product_tier_prices" ON public.product_tier_prices;
CREATE POLICY "Public read product_tier_prices" ON public.product_tier_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Read order items" ON public.order_items;
CREATE POLICY "Read order items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (true);

-- TRIGGER TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- CHÈN DỮ LIỆU MẪU BAN ĐẦU (SEED DATA CHUẨN PHARMADI)
-- ========================================================

-- Chèn Thương hiệu
INSERT INTO public.brands (name, slug, country, is_featured, sort_order) VALUES
('CODEAGE', 'codeage', 'Mỹ', true, 1),
('VITABIOTICS', 'vitabiotics', 'Anh', true, 2),
('SOLGAR', 'solgar', 'Mỹ', true, 3),
('WEBBER NATURALS', 'webber-naturals', 'Canada', true, 4),
('NORDIC NATURALS', 'nordic-naturals', 'Mỹ', true, 5),
('HERBS OF GOLD', 'herbs-of-gold', 'Úc', true, 6),
('OPTIBAC', 'optibac', 'Anh', true, 7),
('BLACKMORES', 'blackmores', 'Úc', true, 8),
('DHC', 'dhc', 'Nhật Bản', true, 9),
('NATURE''S WAY', 'natures-way', 'Úc', true, 10),
('SWISSE', 'swisse', 'Úc', true, 11),
('SOLVITALE', 'solvitale', 'Châu Âu', true, 12)
ON CONFLICT (slug) DO NOTHING;

-- Chèn Nhóm công dụng & Hoạt chất
INSERT INTO public.categories (name, slug, type, sort_order) VALUES
('Phụ nữ', 'phu-nu', 'function', 1),
('Mẹ và bé', 'me-va-be', 'function', 2),
('Người trưởng thành', 'nguoi-truong-thanh', 'function', 3),
('Bổ trí não & Mắt', 'bo-tri-nao-mat', 'function', 4),
('Cơ xương khớp', 'co-xuong-khop', 'function', 5),
('Miễn dịch & Sức khỏe', 'mien-dich-suc-khoe', 'function', 6),
('Gan - Mật', 'gan-mat', 'function', 7),
('Mỡ máu & Tim mạch', 'mo-mau-tim-mach', 'function', 8),
('Canxi', 'canxi', 'ingredient', 10),
('Collagen Type 2', 'collagen-type-2', 'ingredient', 11),
('Tinh dầu hoa anh thảo (EPO)', 'tinh-dau-hoa-anh-thao-epo', 'ingredient', 12),
('Glucosamin', 'glucosamin', 'ingredient', 13),
('Kẽm (Zinc)', 'kem-zinc', 'ingredient', 14),
('Men vi sinh phụ khoa', 'men-vi-sinh-phu-khoa', 'ingredient', 15),
('Milk Thistle (Silymarin)', 'milk-thistle', 'ingredient', 16),
('Omega-3', 'omega-3', 'ingredient', 17),
('Vitamin C', 'vitamin-c', 'ingredient', 18),
('Vitamin D3', 'vitamin-d3', 'ingredient', 19),
('Magnesium', 'magnesium', 'ingredient', 20),
('Sắt (Iron)', 'sat-iron', 'ingredient', 21)
ON CONFLICT (slug) DO NOTHING;

-- Chèn Sản phẩm thực tế từ PharmaDi
DO $$
DECLARE
  b_solvitale UUID;
  b_vitabiotics UUID;
  b_blackmores UUID;
  b_nordic UUID;
  b_dhc UUID;
  b_codeage UUID;
  b_optibac UUID;
BEGIN
  SELECT id INTO b_solvitale FROM public.brands WHERE slug = 'solvitale' LIMIT 1;
  SELECT id INTO b_vitabiotics FROM public.brands WHERE slug = 'vitabiotics' LIMIT 1;
  SELECT id INTO b_blackmores FROM public.brands WHERE slug = 'blackmores' LIMIT 1;
  SELECT id INTO b_nordic FROM public.brands WHERE slug = 'nordic-naturals' LIMIT 1;
  SELECT id INTO b_dhc FROM public.brands WHERE slug = 'dhc' LIMIT 1;
  SELECT id INTO b_codeage FROM public.brands WHERE slug = 'codeage' LIMIT 1;
  SELECT id INTO b_optibac FROM public.brands WHERE slug = 'optibac' LIMIT 1;

  INSERT INTO public.products (name, slug, sku, brand_id, original_price, wholesale_price, reward_points, packaging, thumbnail_url, is_featured, is_in_stock, badge) VALUES
  ('Magnesium + Vitamin B H/30v SOLVITALE MAGNEFOL', 'magnesium-vitamin-b-solvitale-magnefol', 'SOL-MAG-01', b_solvitale, 490000, 294000, 2940, 'H/30v', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', true, true, 'TÍCH LŨY'),
  ('Pregnacare Max H/84v VITABIOTICS Vitamin khoáng chất bổ bầu...', 'pregnacare-max-vitabiotics-84v', 'VITA-PREG-84', b_vitabiotics, 648000, 466600, 4666, 'H/84v', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500', true, true, 'TÍCH LŨY'),
  ('EPO L/190v BLACKMORES Tinh dầu hoa anh thảo', 'epo-blackmores-190v', 'BLK-EPO-190', b_blackmores, 1065900, 624000, 6240, 'L/190v', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', true, true, 'TÍCH LŨY'),
  ('DHA Baby H/60ml NORDIC NATURALS Bổ sung DHA cho trẻ', 'dha-baby-nordic-naturals-60ml', 'NOR-DHAB-60', b_nordic, 648000, 415350, 4153, 'H/60ml', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', true, true, 'TÍCH LŨY'),
  ('Biotin Sustained Release 30Ngày G/30v DHC Hỗ trợ da và tóc', 'biotin-sustained-release-dhc-30v', 'DHC-BIO-30', b_dhc, 240000, 91000, 910, 'G/30v', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500', true, true, 'TÍCH LŨY'),
  ('Liposomal Glutathione Setria H/60v CODEAGE Hỗ trợ trắng da, mờ nám', 'liposomal-glutathione-codeage-60v', 'COD-GLU-60', b_codeage, 1790000, 1253000, 12530, 'H/60v', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', true, true, 'TÍCH LŨY'),
  ('Zinc 30Ngày G/30v DHC Bổ sung kẽm hỗ trợ sức khỏe', 'zinc-dhc-30-ngay', 'DHC-ZNC-30', b_dhc, 170000, 70000, 700, 'G/30v', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', true, true, 'TÍCH LŨY'),
  ('For Women H/30v OPTIBAC Men vi sinh phụ khoa chuyên biệt', 'optibac-for-women-30v', 'OPT-WOM-30', b_optibac, 525000, 378000, 3780, 'H/30v', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500', true, true, 'TÍCH LŨY')
  ON CONFLICT (slug) DO NOTHING;
END $$;
