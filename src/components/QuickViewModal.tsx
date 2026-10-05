'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
} from 'lucide-react';

function QuickViewContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ''
  );

  const inWishlist = isInWishlist(product.id);
  const currentColor = selectedColor || product.colors?.[0]?.name || 'Standard';

  const activeColorVariant = product.colors?.find(
    (c) => c.name.toLowerCase() === currentColor.toLowerCase()
  );
  const displayImage = activeColorVariant?.imageUrl || product.imageUrl;

  const handleAddToCart = () => {
    addToCart(product, quantity, currentColor);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity, currentColor);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pt-2">
          
          {/* Left Column: Product Image Gallery */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="relative w-full h-80 sm:h-96 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden p-6">
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail colors */}
            {product.colors && product.colors.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      currentColor === c.name
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              
              {/* Category & Ratings */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  {product.categoryLabel || product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-slate-800">{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                  {product.name}
                </h2>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                  {product.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.regularPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ₹{product.regularPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-bold">
                  Save {product.discountPercentage}% Instant
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specs Chips */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">{key}</span>
                      <span className="text-xs font-bold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions & Quantity */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                
                {/* Quantity selector */}
                <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center text-sm font-bold disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹{(product.price * quantity).toLocaleString()})</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                    inWishlist
                      ? 'bg-pink-50 text-pink-600 border-pink-200'
                      : 'bg-slate-100 text-slate-600 hover:text-pink-600 border-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-pink-500' : ''}`} />
                </button>
              </div>

              {/* Instant Buy */}
              <button
                type="button"
                onClick={handleInstantBuy}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                Buy Now with 1-Click Express
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useStore();

  if (!quickViewProduct) return null;

  return (
    <QuickViewContent
      key={quickViewProduct.id}
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  );
}
