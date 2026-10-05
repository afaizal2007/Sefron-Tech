'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ArrowRight,
  Zap,
  Volume2,
  BatteryCharging,
  Shield,
  Layers,
  Sparkles,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Star,
} from 'lucide-react';

export default function HeroSection() {
  const { products, addToCart } = useStore();
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });

  const heroProduct = products[0] || {
    name: 'Apple AirPods Pro (2nd Gen)',
    categoryLabel: 'Audio & Earbuds',
    price: 21990,
    regularPrice: 24900,
    discountPercentage: 12,
    rating: 4.9,
    reviewCount: 3420,
    tagline: 'Pro Acoustic Silence',
    description: 'Up to 2x more Active Noise Cancellation with H2 chip.',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -y * 0.03;
    const rotateY = x * 0.03;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 pt-32 sm:pt-36 pb-20 lg:pb-28 overflow-hidden">
      
      {/* Visual Ambient Light Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-100/60 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[250px] -right-32 w-[500px] h-[500px] bg-sky-100/50 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy & Value Proposition */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 z-10">
          
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-[11px] tracking-widest uppercase text-blue-600 font-bold font-mono">
              FLAGSHIP TECH EDITIONS
            </span>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              GENUINE OFFICIAL HARDWARE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-['Outfit']">
            Modern Tech. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
              Unrivaled Quality.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Curated flagship smartphones, noise-cancelling audio, GaN semiconductors, and next-gen gaming consoles. Fast express shipping with complete official warranty support.
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <a
              href="#featured-products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#track-order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Track Your Order</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 w-full max-w-lg text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">100% Original</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">1-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">48h Express Air</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hero Showcase Card */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          
          {/* Backdrop Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-indigo-100/40 to-sky-100/40 rounded-3xl filter blur-2xl transform scale-95 pointer-events-none" />

          {/* Interactive Card */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 transition-transform duration-200 ease-out"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {heroProduct.badge || 'FEATURED'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-slate-800">{heroProduct.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">({heroProduct.reviewCount || 3420})</span>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative w-full h-64 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 overflow-hidden group">
              <img
                src={heroProduct.imageUrl}
                alt={heroProduct.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold text-slate-700 border border-slate-200 shadow-sm">
                {heroProduct.categoryLabel}
              </span>
            </div>

            {/* Product Info & Quick Buy */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  {heroProduct.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {heroProduct.description}
                </p>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      ₹{heroProduct.price?.toLocaleString()}
                    </span>
                    {heroProduct.regularPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{heroProduct.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Save {heroProduct.discountPercentage}% Instant
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(heroProduct as any)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
