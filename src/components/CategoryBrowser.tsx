'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/initialData';
import { ArrowRight, Layers } from 'lucide-react';

export default function CategoryBrowser() {
  const { setSelectedCategory } = useStore();

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const element = document.getElementById('featured-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16" id="categories">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-widest text-blue-600">
            <Layers className="w-4 h-4" />
            <span>Product Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Browse by Category
          </h2>
          <p className="text-sm text-slate-500 max-w-lg">
            Discover precision hardware across 8 dedicated consumer tech departments.
          </p>
        </div>
      </div>

      {/* Grid of Clean Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES_LIST.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            className="group relative bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl p-6 flex flex-col justify-between gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            {/* Top Row: Number & Count */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">
                {cat.number}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-600 text-[11px] font-semibold transition-colors">
                {cat.count}
              </span>
            </div>

            {/* Category Image Box */}
            <div className="w-full h-40 bg-slate-50 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-100">
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 font-['Outfit'] transition-colors">
                  {cat.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {cat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
