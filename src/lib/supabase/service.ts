import { Product, Brand, Category, Order } from '@/types';
import { MOCK_BRANDS, MOCK_FUNCTION_GROUPS, MOCK_INGREDIENTS, MOCK_PRODUCTS } from '../data/mock-products';
import { createClient } from './client';

export async function getProducts(): Promise<Product[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return MOCK_PRODUCTS;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, brands(name, logo_url)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      brand_id: item.brand_id,
      brand_name: item.brands?.name || 'PharmaDi Partner',
      brand_logo: item.brands?.logo_url,
      summary: item.summary,
      description: item.description,
      original_price: Number(item.original_price),
      wholesale_price: Number(item.wholesale_price),
      reward_points: Number(item.reward_points || 0),
      packaging: item.packaging,
      thumbnail_url: item.thumbnail_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
      is_featured: item.is_featured,
      is_in_stock: item.is_in_stock,
      badge: item.badge || 'TÍCH LŨY',
      min_order_qty: item.min_order_qty || 1,
    }));
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to mock products:', err);
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getBrands(): Promise<Brand[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return MOCK_BRANDS;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_BRANDS;
    }

    return data;
  } catch {
    return MOCK_BRANDS;
  }
}

export async function getCategories(): Promise<{ ingredients: Category[]; functions: Category[] }> {
  return {
    ingredients: MOCK_INGREDIENTS,
    functions: MOCK_FUNCTION_GROUPS,
  };
}

export async function submitOrder(order: Order): Promise<{ success: boolean; orderCode: string; error?: string }> {
  const orderCode = 'PMD' + Math.floor(100000 + Math.random() * 900000);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    // Lưu đơn giả lập vào localStorage ở phía client nếu chưa có database
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('pharmadi_orders') || '[]');
      existing.unshift({ ...order, orderCode, created_at: new Date().toISOString() });
      localStorage.setItem('pharmadi_orders', JSON.stringify(existing));
    }
    return { success: true, orderCode };
  }

  try {
    const supabase = createClient();
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_name: order.customer_name,
        pharmacy_name: order.pharmacy_name,
        phone: order.phone,
        address: order.address,
        note: order.note,
        payment_method: order.payment_method,
        total_amount: order.total_amount,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((item) => ({
        order_id: orderResult.id,
        product_id: item.product_id,
        product_name: item.product_name,
        packaging: item.packaging,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      await supabase.from('order_items').insert(itemsToInsert);
    }

    return { success: true, orderCode };
  } catch (error: any) {
    console.error('Order submission failed:', error);
    return { success: false, orderCode: '', error: error?.message || 'Có lỗi xảy ra khi tạo đơn hàng' };
  }
}
