'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    addAllWishlistToCart,
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Saved Wishlist
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-mono font-bold">
              {wishlist.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center text-slate-400 py-12">
            <Heart className="w-12 h-12 text-slate-300" />
            <h4 className="text-base font-bold text-slate-800">Your wishlist is empty</h4>
            <p className="text-xs max-w-xs text-slate-500">Save items you love by tapping the heart icon on any product.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 my-4 divide-y divide-slate-100">
            {wishlist.map((prod) => (
              <div
                key={prod.id}
                className="pt-3 flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200 p-1 flex items-center justify-center">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate font-['Outfit']">
                    {prod.name}
                  </span>
                  <span className="text-[11px] text-slate-400">{prod.categoryLabel}</span>
                  <span className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                    ₹{prod.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(prod, 1);
                      toggleWishlist(prod);
                    }}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-sm"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(prod)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {wishlist.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={addAllWishlistToCart}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
