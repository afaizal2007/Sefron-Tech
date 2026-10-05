'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Tag, Percent, Sparkles } from 'lucide-react';

export default function BulkPriceModal() {
  const {
    isBulkPriceModalOpen,
    setIsBulkPriceModalOpen,
    bulkApplyDiscount,
    products,
  } = useStore();

  const [discountPercent, setDiscountPercent] = useState<number>(35);

  if (!isBulkPriceModalOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    bulkApplyDiscount(Number(discountPercent));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141824] border border-[#00e3fd]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e1f25] border border-[#00e3fd]/30 flex items-center justify-center text-[#00e3fd]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Bulk Pricing & Discount
              </h3>
              <p className="text-xs text-gray-400">
                Adjust pricing on all {products.length} catalog listings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBulkPriceModalOpen(false)}
            className="w-9 h-9 rounded-full bg-[#1e1f25] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e3fd]">
              Global Discount Percentage
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full accent-[#00e3fd] h-2 bg-[#090a0f] rounded-lg cursor-pointer"
              />
              <span className="w-16 text-center px-2 py-1.5 rounded-xl bg-[#090a0f] border border-white/15 text-white font-mono font-bold text-sm">
                {discountPercent}%
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            {[20, 35, 40, 50].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setDiscountPercent(val)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                  discountPercent === val
                    ? 'bg-[#00e3fd] text-[#00285d] border-[#00e3fd]'
                    : 'bg-[#1e1f25] text-gray-300 border-white/10 hover:border-white/25'
                }`}
              >
                {val}% OFF
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#090a0f] border border-white/10 flex items-start gap-2.5 text-xs text-gray-400">
            <Sparkles className="w-4 h-4 text-[#00e3fd] shrink-0 mt-0.5" />
            <span>
              This will automatically recalculate sale prices from regular prices across all products and update discount badges.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsBulkPriceModalOpen(false)}
              className="px-5 py-2 rounded-full bg-[#1e1f25] text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#00e3fd] text-[#001a42] font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Apply to All Products</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
