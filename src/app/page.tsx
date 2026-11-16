'use client';

import React, { useState, useMemo } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import BrandGrid from '@/components/home/BrandGrid';
import CategoryFilters from '@/components/home/CategoryFilters';
import ProductCard from '@/components/product/ProductCard';
import KnowledgeSection from '@/components/home/KnowledgeSection';
import { MOCK_PRODUCTS, MOCK_FUNCTION_GROUPS, MOCK_INGREDIENTS } from '@/lib/data/mock-products';
import { MOCK_BLOG_POSTS } from '@/lib/wordpress/mock-data';
import { Sparkles, Flame, CheckCircle, Search, SlidersHorizontal } from 'lucide-react';

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string>('all');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Lọc sản phẩm động theo tương tác của người dùng
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Lọc theo thương hiệu
      if (selectedBrand && product.brand_name.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // 2. Lọc theo nhóm công dụng
      if (selectedFunction !== 'all' && product.functions && !product.functions.includes(selectedFunction)) {
        return false;
      }
      // 3. Lọc theo thành phần hoạt chất
      if (selectedIngredient && product.ingredients && !product.ingredients.includes(selectedIngredient)) {
        return false;
      }
      // 4. Lọc theo từ khóa tìm kiếm
      if (searchFilter) {
        const query = searchFilter.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = product.brand_name.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchSku) return false;
      }
      return true;
    });
  }, [selectedBrand, selectedFunction, selectedIngredient, searchFilter]);

  // Nhóm các danh mục sản phẩm trên trang chủ
  const featuredProducts = filteredProducts.slice(0, 6);
  const promoProducts = filteredProducts.slice(2, 8);
  const recommendedProducts = filteredProducts.slice(4, 12);

  const resetAllFilters = () => {
    setSelectedBrand(null);
    setSelectedFunction('all');
    setSelectedIngredient('');
    setSearchFilter('');
  };

  const isFiltering = selectedBrand || selectedFunction !== 'all' || selectedIngredient || searchFilter;

  return (
    <div className="pb-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Grid Thương hiệu */}
      <BrandGrid
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => setSelectedBrand(brand === selectedBrand ? null : brand)}
      />

      {/* 3. Bộ lọc Thành phần & Nhóm công dụng */}
      <CategoryFilters
        ingredients={MOCK_INGREDIENTS}
        functions={MOCK_FUNCTION_GROUPS}
        selectedFunction={selectedFunction}
        onSelectFunction={setSelectedFunction}
        selectedIngredient={selectedIngredient}
        onSelectIngredient={setSelectedIngredient}
      />

      {/* Thông báo bộ lọc đang kích hoạt */}
      {isFiltering && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-sky-800">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Đang lọc theo:</span>
              {selectedBrand && (
                <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-sky-200">
                  Thương hiệu: {selectedBrand}
                </span>
              )}
              {selectedFunction !== 'all' && (
                <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-sky-200">
                  Công dụng: {selectedFunction}
                </span>
              )}
              {selectedIngredient && (
                <span className="font-bold bg-white px-2.5 py-1 rounded-lg border border-sky-200">
                  Hoạt chất: {selectedIngredient}
                </span>
              )}
              <span className="text-gray-500">({filteredProducts.length} sản phẩm phù hợp)</span>
            </div>
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* 4. Section: Sản phẩm nổi bật */}
      <section id="san-pham" className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-800">Sản phẩm nổi bật</h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">Nguồn hàng nhập khẩu chính hãng</span>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={resetAllFilters}
              className="mt-3 text-xs text-sky-600 font-bold hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Section: Banner Khuyến Mãi Flash Sale (Chuẩn PharmaDi page 4) */}
      <section id="khuyen-mai" className="max-w-7xl mx-auto px-4 mt-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-lg flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương trình ưu đãi nhà thuốc</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">SẢN PHẨM ĐANG KHUYẾN MÃI</h3>
            <p className="text-xs sm:text-sm text-sky-100">
              Chiết khấu thêm từ 5% - 15% khi nhập theo số lượng thùng. Tặng quà và tích lũy điểm thưởng.
            </p>
          </div>
          <a
            href="#san-pham"
            className="px-6 py-2.5 rounded-full bg-white text-sky-800 font-extrabold text-xs sm:text-sm hover:bg-sky-50 shadow-md transition"
          >
            Nhập sỉ khuyến mãi
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {promoProducts.map((product) => (
            <ProductCard key={'promo-' + product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Section: Sản phẩm quan tâm (page 6) */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-800">Sản phẩm quan tâm nhiều nhất</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={'rec-' + product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Section: Tri thức Y Dược (Headless WordPress CMS integration) */}
      <KnowledgeSection posts={MOCK_BLOG_POSTS} />
    </div>
  );
}
