'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Star } from 'lucide-react';

export default function SearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    setQuickViewProduct,
    setSelectedCategory,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20 sm:pt-28">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-blue-600" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search smartphones, gaming consoles, AirPods, fast chargers..."
            className="w-full bg-transparent text-slate-900 text-base placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['All', 'Gaming', 'Mobiles', 'Audio', 'Wearables', 'Speakers', 'Power', 'Protection', 'Cables'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setIsSearchOpen(false);
                const el = document.getElementById('featured-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 font-semibold whitespace-nowrap transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 divide-y divide-slate-100">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching products found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setQuickViewProduct(p);
                  setIsSearchOpen(false);
                }}
                className="flex items-center justify-between gap-3 pt-2 p-2.5 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-['Outfit']">
                      {p.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {p.categoryLabel} • {p.tagline}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      ₹{p.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-slate-700">{p.rating}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
