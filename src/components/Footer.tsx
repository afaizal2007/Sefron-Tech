'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../context/StoreContext';
import { Mail, ArrowRight, ShieldCheck, Lock, Sparkles, Check } from 'lucide-react';
import SefronLogo from './SefronLogo';

export default function Footer() {
  const { setSelectedCategory, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('⚡ 15% discount code "SEFRONTECH" sent to your email!');
      setEmail('');
    }
  };

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    const catalogElement = document.getElementById('featured-products');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-slate-100/90 text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-slate-200">
          
          {/* Col 1: Shop & Explore */}
          <div className="flex flex-col gap-4">
            <span className="text-base font-bold text-slate-900 tracking-tight font-['Outfit']">
              Shop by Department
            </span>
            <div className="flex flex-col gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleCategoryNav('Audio')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                Noise-Cancelling AirPods & Earbuds
              </button>
              <button
                type="button"
                onClick={() => handleCategoryNav('Mobiles')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                Flagship Titanium Smartphones
              </button>
              <button
                type="button"
                onClick={() => handleCategoryNav('Gaming')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                PlayStation 5 & Handheld Consoles
              </button>
              <button
                type="button"
                onClick={() => handleCategoryNav('Wearables')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                Apple Watch & Smartwatches
              </button>
              <button
                type="button"
                onClick={() => handleCategoryNav('Power')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                65W & 100W GaN Fast Chargers
              </button>
              <button
                type="button"
                onClick={() => handleCategoryNav('Protection')}
                className="text-left hover:text-blue-600 transition-colors"
              >
                Aramid Fiber Cases & 9H Glass
              </button>
            </div>
          </div>

          {/* Col 2: Support & Warranty */}
          <div className="flex flex-col gap-4">
            <span className="text-base font-bold text-slate-900 tracking-tight font-['Outfit']">
              Support & Service
            </span>
            <div className="flex flex-col gap-2.5 text-xs">
              <a href="#why-us" className="hover:text-blue-600 transition-colors">
                1-Year Official Replacement Warranty
              </a>
              <a href="#why-us" className="hover:text-blue-600 transition-colors">
                Track Active Air Express Consignment
              </a>
              <a href="#why-us" className="hover:text-blue-600 transition-colors">
                48-Hour Priority Express Shipping
              </a>
              <a href="#why-us" className="hover:text-blue-600 transition-colors">
                Authenticity QR Seal Guarantee
              </a>
              <a href="#why-us" className="hover:text-blue-600 transition-colors">
                24/7 WhatsApp Concierge Support
              </a>
            </div>
          </div>

          {/* Col 3: Management & Links */}
          <div className="flex flex-col gap-4">
            <span className="text-base font-bold text-slate-900 tracking-tight font-['Outfit']">
              Store Administration
            </span>
            <div className="flex flex-col gap-2.5 text-xs">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </Link>
              <a href="#track-order" className="hover:text-blue-600 transition-colors font-semibold">
                Track Live Order by Phone/Email
              </a>
              <a href="#special-deals" className="hover:text-blue-600 transition-colors">
                Current Flash Clearances
              </a>
              <a href="#reviews" className="hover:text-blue-600 transition-colors">
                Customer Testimonials
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight font-['Outfit']">
                VIP Private Drop Alerts
              </span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Subscribe for confidential product drop alerts, warranty updates, and seasonal deals.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex items-center rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:border-blue-500 shadow-sm transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-all shadow-sm"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Get 15% OFF'}
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                Instant promo voucher code delivered immediately.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <SefronLogo className="w-7 h-7" />
              <span className="text-slate-900 font-extrabold font-['Outfit'] tracking-wider text-sm">
                SEFRON <span className="text-blue-600">TECH</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>© 2026 SEFRON TECH. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted Payments
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Admin Login
            </Link>
            <a
              href="https://www.instagram.com/sefrontechnologies?stkn=MW5hdmYzNWNxdGxzdA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@sefrontechnologies?si=bZHChKVBbRdbLq0r"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
