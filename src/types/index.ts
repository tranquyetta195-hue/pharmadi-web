export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  country: string;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'ingredient' | 'function' | 'general';
  icon?: string;
  icon_url?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand_id: string;
  brand_name: string;
  brand_logo?: string;
  summary: string;
  description?: string;
  original_price: number; // Giá niêm yết
  wholesale_price: number; // Giá sỉ tốt nhất
  reward_points?: number; // Điểm tích lũy
  packaging: string; // vd: H/30v, L/60v, H/60ml
  thumbnail_url: string;
  images?: string[];
  is_featured?: boolean;
  is_in_stock: boolean;
  badge?: string; // 'TÍCH LŨY', 'HOT', 'MỚI'
  min_order_qty?: number;
  ingredients?: string[];
  functions?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  pharmacy_name: string;
  phone: string;
  address: string;
  province?: string;
  note?: string;
  payment_method: 'cod' | 'vietqr' | 'consultation';
  total_amount: number;
  items: {
    product_id: string;
    product_name: string;
    packaging: string;
    quantity: number;
    unit_price: number;
  }[];
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author_name: string;
  featured_image: string;
  category_name: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  pharmacy_name?: string;
  address?: string;
  gpp_number?: string;
  is_verified?: boolean;
  role: 'customer' | 'admin';
}
