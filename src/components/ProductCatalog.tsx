'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Search,
  SlidersHorizontal,
  Check,
  ShieldCheck,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop';

export default function ProductCatalog() {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useStore();

  const [activeCardColors, setActiveCardColors] = useState<{ [productId: string]: { name: string; hex: string; imageUrl?: string } }>({});

  const categoryPills = [
    { id: 'All', label: 'All Products' },
    { id: 'Gaming', label: '🎮 Gaming' },
    { id: 'Mobiles', label: '📱 Mobiles' },
    { id: 'Audio', label: '🎧 Audio & AirPods' },
    { id: 'Wearables', label: '⌚ Smart Watches' },
    { id: 'Speakers', label: '🔊 Speakers' },
    { id: 'Power', label: '⚡ Fast Power' },
    { id: 'Protection', label: '🛡️ Cases' },
    { id: 'Cables', label: '🔌 Cables' },
  ];

  const handleSelectColor = (e: React.MouseEvent, productId: string, colorName: string, hex: string, imageUrl?: string) => {
    e.stopPropagation();
    setActiveCardColors((prev) => ({
      ...prev,
      [productId]: { name: colorName, hex, imageUrl },
    }));
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16" id="featured-products">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
            CURATED CATALOG
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Featured Tech Collection
          </h2>
          <p className="text-sm text-slate-500 max-w-lg">
            Genuine manufacturer sealed electronics with full official warranty and express air delivery.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200 max-w-full overflow-x-auto">
          {categoryPills.map((pill) => {
            const isActive = selectedCategory.toLowerCase() === pill.id.toLowerCase();
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedCategory(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by model, brand, or specs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> items
          </span>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const inWishlist = isInWishlist(product.id);
          const selectedColor = activeCardColors[product.id] || product.colors?.[0];

          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image & Badges */}
              <div className="relative w-full h-56 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
                
                {/* Product Image */}
                <img
                  src={selectedColor?.imageUrl || product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {product.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                      {product.badge}
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                {/* Quick Action Floating Buttons (Wishlist & Quick View) */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      inWishlist
                        ? 'bg-pink-50 text-pink-600 border border-pink-200'
                        : 'bg-white/90 text-slate-500 hover:text-pink-600 hover:bg-white border border-slate-200'
                    }`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-pink-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all shadow-sm"
                    title="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {product.categoryLabel || product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-slate-700 text-[11px]">{product.rating}</span>
                  </div>
                </div>

                <h3
                  onClick={() => setQuickViewProduct(product)}
                  className="font-bold text-slate-900 text-sm font-['Outfit'] hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                >
                  {product.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Color swatches */}
                {product.colors && product.colors.length > 1 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={(e) => handleSelectColor(e, product.id, c.name, c.hex, c.imageUrl)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          selectedColor?.name === c.name
                            ? 'ring-2 ring-blue-500 ring-offset-1 scale-110'
                            : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">
                      {selectedColor?.name || ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Add to Cart Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.regularPrice > product.price && (
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      ₹{product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, 1, selectedColor?.name)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
          <Search className="w-10 h-10 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800 font-['Outfit']">
            No products found matching your filter
          </h3>
          <p className="text-xs text-slate-500">
            Try searching for another keyword or reset the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
