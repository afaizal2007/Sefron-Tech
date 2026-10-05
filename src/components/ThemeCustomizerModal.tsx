'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { AppTheme, AppStyle } from '../types/store';
import {
  X,
  Palette,
  Sparkles,
  Layers,
  Check,
  Zap,
  Sun,
  Moon,
  Flame,
  Cpu,
  Eye,
  Sliders,
  Activity,
  Shield,
  Radio,
} from 'lucide-react';
import SefronLogo from './SefronLogo';

interface ThemeOption {
  id: AppTheme;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  icon: React.ReactNode;
  description: string;
}

interface StyleOption {
  id: AppStyle;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

export default function ThemeCustomizerModal() {
  const {
    theme,
    setTheme,
    styleMode,
    setStyleMode,
    glowIntensity,
    setGlowIntensity,
    isThemeModalOpen,
    setIsThemeModalOpen,
    showToast,
  } = useStore();

  if (!isThemeModalOpen) return null;

  const themes: ThemeOption[] = [
    {
      id: 'cyber-cyan',
      name: 'Cyber Cyan',
      tagline: 'Signature SEFRON Neo-Tokyo',
      primaryColor: '#00e3fd',
      accentColor: '#3b82f6',
      bgColor: '#090a0f',
      surfaceColor: '#141824',
      icon: <Zap className="w-4 h-4 text-[#00e3fd]" />,
      description: 'Iconic neon cyan lasers with cobalt blue deep-space reflections.',
    },
    {
      id: 'neon-matrix',
      name: 'Neon Matrix',
      tagline: 'Cyber Emerald Terminal',
      primaryColor: '#10b981',
      accentColor: '#00ff88',
      bgColor: '#050e0a',
      surfaceColor: '#0d2017',
      icon: <Cpu className="w-4 h-4 text-[#10b981]" />,
      description: 'Phosphor green terminal telemetry with deep bioluminescent glow.',
    },
    {
      id: 'crimson-eclipse',
      name: 'Crimson Eclipse',
      tagline: 'Rogue Red & Blaze Amber',
      primaryColor: '#f43f5e',
      accentColor: '#fb923c',
      bgColor: '#0e0508',
      surfaceColor: '#220e15',
      icon: <Flame className="w-4 h-4 text-[#f43f5e]" />,
      description: 'Intense hypercar crimson with warm burning amber highlights.',
    },
    {
      id: 'hyper-violet',
      name: 'Hyper Violet',
      tagline: 'Synthwave & Deep Cosmos',
      primaryColor: '#a855f7',
      accentColor: '#ec4899',
      bgColor: '#0a0614',
      surfaceColor: '#1b1133',
      icon: <Sparkles className="w-4 h-4 text-[#a855f7]" />,
      description: 'Electric ultraviolet neon with synthwave magenta radiance.',
    },
    {
      id: 'solar-gold',
      name: 'Solar Gold',
      tagline: 'Luxury Champagne Amber',
      primaryColor: '#f59e0b',
      accentColor: '#ffd700',
      bgColor: '#0d0a04',
      surfaceColor: '#241c0c',
      icon: <Sun className="w-4 h-4 text-[#f59e0b]" />,
      description: 'Prestige 24K gold metallic speculars with warm amber lighting.',
    },
    {
      id: 'midnight-obsidian',
      name: 'Midnight Obsidian',
      tagline: 'Stealth Titanium Monochrome',
      primaryColor: '#e2e8f0',
      accentColor: '#64748b',
      bgColor: '#030406',
      surfaceColor: '#111317',
      icon: <Moon className="w-4 h-4 text-[#cbd5e1]" />,
      description: 'Minimalist true-black OLED stealth with Arctic silver precision.',
    },
    {
      id: 'daylight-cyber',
      name: 'Daylight Cyber',
      tagline: 'Futuristic High-Key Frost',
      primaryColor: '#0284c7',
      accentColor: '#2563eb',
      bgColor: '#f8fafc',
      surfaceColor: '#ffffff',
      icon: <Eye className="w-4 h-4 text-[#0284c7]" />,
      description: 'Crisp light-mode laboratory aesthetic with frosted glass layers.',
    },
  ];

  const styles: StyleOption[] = [
    {
      id: 'cyber-hud',
      name: 'Cyber HUD Protocol',
      tagline: 'High-Tech Hardware Telemetry',
      description: 'Scanlines, glowing neon laser borders, monospace telemetry counters, and angular technical corners.',
      badge: 'HIGH TECH',
      icon: <Sliders className="w-4 h-4 text-[#00e3fd]" />,
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism Luxe',
      tagline: 'Frosted Glass & Ambient Blur',
      description: 'Ultra-deep backdrop blur (24px), smooth rounded contours, and floating optical elevation.',
      badge: 'LUXURY',
      icon: <Layers className="w-4 h-4 text-[#c0c1ff]" />,
    },
    {
      id: 'minimal-tokyo',
      name: 'Minimalist Tokyo',
      tagline: 'Sharp Razor Contrast',
      description: 'Clean architectural lines, high-contrast monochrome typography, and refined micro-borders.',
      badge: 'MINIMAL',
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
    },
  ];

  const glowOptions: { id: 'subtle' | 'vibrant' | 'ultra'; label: string; desc: string }[] = [
    { id: 'subtle', label: 'Subtle Precision', desc: 'Minimalist ambient rim lights with low glare' },
    { id: 'vibrant', label: 'Vibrant Holographic', desc: 'Balanced high-contrast neon glows and reflections' },
    { id: 'ultra', label: 'Ultra Photonic', desc: 'Maximum cyber radiance, intense laser blooms & 3D halos' },
  ];

  const handleSelectTheme = (selectedId: AppTheme) => {
    setTheme(selectedId);
    showToast(`Theme calibrated to ${themes.find((t) => t.id === selectedId)?.name}`, 'info');
  };

  const handleSelectStyle = (selectedStyle: AppStyle) => {
    setStyleMode(selectedStyle);
    showToast(`Interface style set to ${styles.find((s) => s.id === selectedStyle)?.name}`, 'info');
  };

  const handleSelectGlow = (g: 'subtle' | 'vibrant' | 'ultra') => {
    setGlowIntensity(g);
    showToast(`Glow intensity calibrated to ${g.toUpperCase()}`, 'info');
  };

  const activeThemeObj = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#11131c] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-5 sm:p-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsThemeModalOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#1e1f25] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <SefronLogo className="w-12 h-12 shrink-0" glow={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--theme-primary,#00e3fd)]">
                STUDIO ARCHITECTURE CONFIGURATOR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-gray-300">
                PRO ENGINE v4
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-0.5">
              Theme & Style Studio
            </h2>
          </div>
        </div>

        {/* 1. Color Theme Palette Selector */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e3fd] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 1. Select Color Spectrum Palette
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Active: <strong className="text-white">{activeThemeObj.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTheme(t.id)}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 overflow-hidden flex flex-col justify-between min-h-[120px] ${
                    isSelected
                      ? 'bg-[#181c2e] border-white/40 shadow-xl scale-[1.02]'
                      : 'bg-[#0e1017] border-white/10 hover:border-white/25 hover:bg-[#141824]'
                  }`}
                  style={{
                    borderColor: isSelected ? t.primaryColor : undefined,
                    boxShadow: isSelected ? `0 0 24px ${t.primaryColor}40` : undefined,
                  }}
                >
                  {/* Swatch Header */}
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-inner ring-2 ring-white/10"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <div
                        className="w-3 h-3 rounded-full shadow-inner -ml-2"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      <span className="text-sm font-bold text-white font-['Outfit'] ml-0.5">
                        {t.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[#090a0f] text-xs font-bold"
                        style={{ backgroundColor: t.primaryColor }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-gray-400 leading-tight mb-2.5">
                    {t.description}
                  </p>

                  {/* Bottom Accent Bar */}
                  <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden flex">
                    <div
                      className="h-full"
                      style={{ backgroundColor: t.primaryColor, width: '65%' }}
                    />
                    <div
                      className="h-full"
                      style={{ backgroundColor: t.accentColor, width: '35%' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Visual Architecture & Style Mode Selector */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--theme-primary,#00e3fd)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 2. Interface Aesthetic & Layout Architecture
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Active: <strong className="text-white">{styles.find((s) => s.id === styleMode)?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {styles.map((s) => {
              const isSelected = styleMode === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectStyle(s.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#181c2e] border-white/40 shadow-lg scale-[1.02]'
                      : 'bg-[#0e1017] border-white/10 hover:border-white/25 hover:bg-[#141824]'
                  }`}
                  style={{
                    borderColor: isSelected ? activeThemeObj.primaryColor : undefined,
                    boxShadow: isSelected ? `0 0 24px ${activeThemeObj.primaryColor}35` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {s.icon}
                      <span className="text-xs font-bold text-white font-mono">
                        {s.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        className="w-4 h-4 rounded-full text-[#090a0f] flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: activeThemeObj.primaryColor }}
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-snug mb-3">
                    {s.description}
                  </p>

                  <span className="self-start text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {s.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Photonic Glow & Radiance Intensity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--theme-primary,#00e3fd)] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> 3. Ambient Laser Glow & Radiance Intensity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {glowOptions.map((g) => {
              const isSelected = glowIntensity === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGlow(g.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#181c2e] border-white/40 text-white shadow-md'
                      : 'bg-[#0e1017] border-white/10 text-gray-400 hover:text-white hover:bg-[#141824]'
                  }`}
                  style={{
                    borderColor: isSelected ? activeThemeObj.primaryColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-['Outfit']">
                      {g.label}
                    </span>
                    {isSelected && (
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: activeThemeObj.primaryColor }}
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {g.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00e3fd]" />
            Session synced and saved to persistent memory.
          </span>
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(false)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#00e3fd] hover:from-[#2563eb] hover:to-[#00c9e0] text-[#001a42] font-extrabold text-xs shadow-[0_0_20px_rgba(0,227,253,0.35)] transition-all"
          >
            Apply & Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
