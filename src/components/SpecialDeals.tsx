'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ArrowRight, Timer, Zap } from 'lucide-react';

export default function SpecialDeals() {
  const { setSelectedCategory } = useStore();

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: 'deal-1',
      tag: 'Studio Audio Deals',
      title: 'Up to 25% OFF Flagship Headphones',
      description: 'Includes complimentary carrying case and cable kit.',
      priceNote: 'From ₹9,999',
      category: 'Audio',
    },
    {
      id: 'deal-2',
      tag: 'GaN Fast Charging',
      title: '65W & 100W Chargers from ₹2,499',
      description: 'Ultra-compact GaN III wall bricks and laptop battery banks.',
      priceNote: 'Limited Stock',
      category: 'Power',
    },
    {
      id: 'deal-3',
      tag: 'Gaming Specials',
      title: 'PlayStation 5 & Switch Bundles',
      description: 'Instant discounts on consoles and extra controller combos.',
      priceNote: 'Save ₹5,000',
      category: 'Gaming',
    },
    {
      id: 'deal-4',
      tag: 'Aramid & MagSafe',
      title: 'Cases & Screen Protectors',
      description: '100% Genuine aerospace aramid weave and 9H sapphire shields.',
      priceNote: 'From ₹1,299',
      category: 'Protection',
    },
  ];

  const handleDealClick = (cat: string) => {
    setSelectedCategory(cat);
    const catalogElement = document.getElementById('featured-products');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16" id="special-deals">
      
      {/* Header & Live Ticking Countdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-mono uppercase tracking-widest font-bold">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>LIMITED-TIME PROMOTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Exclusive Deals & Bundle Offers
          </h2>
          <p className="text-sm text-slate-500 max-w-lg">
            Special pricing on premium hardware. Guaranteed express priority delivery.
          </p>
        </div>

        {/* Countdown Ticker Box */}
        <div className="flex items-center gap-3 self-start lg:self-auto bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Timer className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="hidden sm:inline">OFFER EXPIRES IN:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono font-extrabold text-base text-slate-900">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm text-blue-600">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Clean Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => handleDealClick(deal.category)}
            className="group relative bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl p-6 flex flex-col justify-between gap-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600">
                {deal.tag}
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 font-['Outfit'] transition-colors">
                {deal.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {deal.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-mono text-sm font-extrabold text-slate-900">
                {deal.priceNote}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
