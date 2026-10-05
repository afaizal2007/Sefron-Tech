'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import SefronLogo from './SefronLogo';

export default function Header() {
  const {
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    wishlist,
    setIsWishlistOpen,
    setIsSearchOpen,
    setSelectedCategory,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Shop', href: '#featured-products' },
    { label: 'Categories', href: '#categories' },
    { label: 'Deals', href: '#special-deals' },
    { label: 'Track Order', href: '#track-order' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Reviews', href: '#reviews' },
  ];

  return (
    <>
      {/* 1. VIP Top Announcement Strip */}
      <aside className="fixed top-0 left-0 right-0 z-50 h-9 bg-slate-900 text-slate-100 text-center flex items-center justify-center px-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">VIP OFFER:</span>
          <span>FREE EXPRESS AIR SHIPPING ACROSS INDIA OVER ₹1,999</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline bg-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono font-bold border border-slate-700">
            CODE: SEFRONTECH (15% OFF)
          </span>
        </div>
      </aside>

      {/* 2. Main Header */}
      <header
        className={`fixed top-9 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <SefronLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                  SEFRON <span className="text-blue-600">TECH</span>
                </span>
                <span className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold uppercase">
                  Flagship Store
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-600" /> Official Store
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/80 border border-slate-200/80 rounded-full">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  if (link.label === 'Shop') setSelectedCategory('All');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-none hover:shadow-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Dedicated Admin Dashboard Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all shadow-sm"
              title="Access Admin Management Portal"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all"
              aria-label="Search catalog"
              title="Search products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Trigger */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-pink-600 transition-all"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
            >
              <div className="relative w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white">
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-extrabold">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[9px] uppercase font-semibold text-blue-200 tracking-wider">
                  Cart
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  ₹{cartSubtotal.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-2 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.label === 'Shop') setSelectedCategory('All');
                }}
                className="py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <Zap className="w-3.5 h-3.5 text-blue-600" />
              </a>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 flex items-center justify-between mt-2"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Dashboard</span>
              </div>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
