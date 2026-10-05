'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Lock,
  ArrowRight,
  Zap,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import SefronLogo from './SefronLogo';

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <SefronLogo className="w-8 h-8" />
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Shopping Cart
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 my-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ⚡ Free Express Shipping Unlocked!
              </span>
            ) : (
              <span className="text-slate-600">
                Add <strong className="text-blue-600 font-mono">₹{remainingForFreeShipping}</strong> for Free Air Shipping
              </span>
            )}
            <span className="font-mono text-slate-400 text-[11px]">
              ₹{cartSubtotal} / ₹{freeShippingThreshold}
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items Scroll List */}
        <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 pr-1 divide-y divide-slate-100">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="pt-3 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.product.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.selectedColor ? `Finish: ${item.selectedColor}` : item.product.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 mt-1">
                    ₹{item.product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-md hover:bg-white text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-md hover:bg-white text-slate-700 flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Your cart is currently empty</p>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCode} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={appliedCoupon ? `Applied: ${appliedCoupon}` : 'Promo code (SEFRONTECH)'}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Price Calculations */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-800">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>VIP Discount</span>
                  <span className="font-mono">-₹{cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-semibold text-slate-800">
                  {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount</span>
                <span className="font-mono text-blue-600">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
