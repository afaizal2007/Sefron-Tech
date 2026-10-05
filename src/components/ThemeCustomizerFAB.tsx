'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Palette } from 'lucide-react';

export default function ThemeCustomizerFAB() {
  const { setIsThemeModalOpen } = useStore();

  return (
    <button
      type="button"
      onClick={() => setIsThemeModalOpen(true)}
      className="fixed bottom-6 right-24 z-40 p-3 rounded-full bg-[#141824]/90 hover:bg-[#1e2336] border border-[var(--theme-primary,#00e3fd)]/40 text-[var(--theme-primary,#00e3fd)] shadow-[0_0_20px_var(--theme-primary-glow,rgba(0,227,253,0.3))] backdrop-blur-md hover:scale-110 active:scale-95 transition-all group"
      title="Customize Theme & UI Style"
      aria-label="Open Theme Customizer"
    >
      <div className="relative">
        <Palette className="w-5 h-5 transition-transform group-hover:rotate-45" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--theme-primary,#00e3fd)] animate-pulse" />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#0e111a] border border-white/10 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
        Theme & Style
      </span>
    </button>
  );
}
