'use client';

import React from 'react';
import { Sparkles, Layers, Activity } from 'lucide-react';
import { Category } from '@/types';

interface CategoryFiltersProps {
  ingredients: Category[];
  functions: Category[];
  selectedFunction: string;
  onSelectFunction: (slug: string) => void;
  selectedIngredient: string;
  onSelectIngredient: (slug: string) => void;
}

export default function CategoryFilters({
  ingredients,
  functions,
  selectedFunction,
  onSelectFunction,
  selectedIngredient,
  onSelectIngredient,
}: CategoryFiltersProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 space-y-8">
      {/* 1. Nhóm công dụng (Tabs) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-sky-600" />
          <h3 className="text-xl font-bold text-slate-800">Nhóm công dụng</h3>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {functions.map((fn) => {
            const isSelected = selectedFunction === fn.slug;
            return (
              <button
                key={fn.id}
                onClick={() => onSelectFunction(fn.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                {fn.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Thành phần nổi bật (Pills) */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-800">Thành phần & Hoạt chất</h4>
          </div>
          {selectedIngredient && (
            <button
              onClick={() => onSelectIngredient('')}
              className="text-xs text-sky-600 hover:underline font-medium"
            >
              Bỏ lọc hoạt chất
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => {
            const isSelected = selectedIngredient === ing.slug;
            return (
              <button
                key={ing.id}
                onClick={() => onSelectIngredient(isSelected ? '' : ing.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                <span>{ing.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
