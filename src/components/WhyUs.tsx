'use client';

import React from 'react';
import {
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  RotateCcw,
} from 'lucide-react';

export default function WhyUs() {
  const pillars = [
    {
      icon: Truck,
      title: 'Priority Air Dispatch',
      description: 'Same-day order processing with 48-hour express nationwide air shipping across India.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: ShieldCheck,
      title: '256-Bit SSL Security',
      description: 'End-to-end encrypted UPI (GPay, PhonePe, Paytm), RuPay, cards, and COD support.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Award,
      title: '1-Year Official Warranty',
      description: '100% genuine manufacturer sealed items with complimentary doorstep replacement.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Headphones,
      title: '24/7 Tech Concierge',
      description: 'Dedicated hardware and setup specialists accessible directly via live chat and WhatsApp.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      description: 'Zero-hassle doorstep pickup and automated instant refund processing back to source.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16" id="why-us">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
          THE SEFRON GUARANTEE
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] mt-1">
          Quality You Can Trust. Service You Can Rely On.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Every device is rigorously inspected and sealed with official authenticity verification.
        </p>
      </div>

      {/* 5 Pillar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
