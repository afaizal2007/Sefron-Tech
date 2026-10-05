/**
 * Enhanced Utility to calculate dynamic real-time color filter and blend tinting
 * for product images based on selected color finish.
 */

export interface ColorFinishStyle {
  filter: string;
  tintOverlayColor?: string;
  tintBlendMode?: 'color' | 'overlay' | 'soft-light' | 'hue' | 'multiply' | 'screen';
  tintOpacity?: number;
  glowColor: string;
  accentGradient: string;
  borderColor: string;
  textColor: string;
}

export function getColorTransform(colorName?: string, hexColor?: string): ColorFinishStyle {
  const name = (colorName || '').toLowerCase();
  const hex = hexColor || '#00e5ff';

  // 1. Black / Obsidian / Stealth / Midnight / Carbon / Graphite / Dark
  if (
    name.includes('obsidian') ||
    name.includes('stealth') ||
    name.includes('black') ||
    name.includes('midnight') ||
    name.includes('carbon') ||
    name.includes('graphite') ||
    name.includes('charcoal')
  ) {
    return {
      filter: 'brightness(0.72) contrast(1.35) saturate(0.5)',
      tintOverlayColor: 'rgba(10, 14, 24, 0.45)',
      tintBlendMode: 'color',
      tintOpacity: 0.5,
      glowColor: 'rgba(100, 116, 139, 0.6)',
      accentGradient: 'from-slate-900 via-gray-900 to-black',
      borderColor: 'rgba(148, 163, 184, 0.4)',
      textColor: '#e2e8f0',
    };
  }

  // 2. Cyan / Electric / Neon Blue / Azure / Sky / Ultramarine
  if (
    name.includes('cyan') ||
    name.includes('electric') ||
    name.includes('neon') ||
    name.includes('azure') ||
    name.includes('sky') ||
    name.includes('ripple') ||
    (name.includes('blue') && !name.includes('navy'))
  ) {
    return {
      filter: 'hue-rotate(170deg) saturate(2.2) brightness(1.08) contrast(1.15)',
      tintOverlayColor: 'rgba(0, 229, 255, 0.42)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(0, 229, 255, 0.75)',
      accentGradient: 'from-cyan-500 to-blue-600',
      borderColor: 'rgba(0, 229, 255, 0.6)',
      textColor: '#00e5ff',
    };
  }

  // 3. Navy / Deep Blue / Submarine / Ocean
  if (name.includes('navy') || name.includes('ocean') || name.includes('submarine') || name.includes('sapphire')) {
    return {
      filter: 'hue-rotate(200deg) saturate(1.8) brightness(0.9) contrast(1.2)',
      tintOverlayColor: 'rgba(28, 59, 95, 0.55)',
      tintBlendMode: 'color',
      tintOpacity: 0.5,
      glowColor: 'rgba(37, 99, 235, 0.7)',
      accentGradient: 'from-blue-900 to-indigo-950',
      borderColor: 'rgba(59, 130, 246, 0.6)',
      textColor: '#93c5fd',
    };
  }

  // 4. Titanium / Silver / Glacier / Frost / Gray / Grey / Lunar / Shadow
  if (
    name.includes('titanium') ||
    name.includes('silver') ||
    name.includes('glacier') ||
    name.includes('frost') ||
    name.includes('gray') ||
    name.includes('grey') ||
    name.includes('lunar') ||
    name.includes('smoke') ||
    name.includes('shadow') ||
    name.includes('mirror')
  ) {
    return {
      filter: 'brightness(1.22) contrast(1.18) grayscale(0.65) sepia(0.05)',
      tintOverlayColor: 'rgba(203, 213, 225, 0.35)',
      tintBlendMode: 'soft-light',
      tintOpacity: 0.4,
      glowColor: 'rgba(203, 213, 225, 0.7)',
      accentGradient: 'from-slate-400 via-gray-300 to-slate-500',
      borderColor: 'rgba(226, 232, 240, 0.6)',
      textColor: '#f1f5f9',
    };
  }

  // 5. White / Porcelain / Ceramic / Milk / Crystal / Clear / Arctic
  if (
    name.includes('white') ||
    name.includes('porcelain') ||
    name.includes('ceramic') ||
    name.includes('milk') ||
    name.includes('crystal') ||
    name.includes('arctic') ||
    name.includes('clear')
  ) {
    return {
      filter: 'brightness(1.38) contrast(1.08) saturate(0.2)',
      tintOverlayColor: 'rgba(255, 255, 255, 0.38)',
      tintBlendMode: 'soft-light',
      tintOpacity: 0.45,
      glowColor: 'rgba(255, 255, 255, 0.85)',
      accentGradient: 'from-white via-slate-100 to-gray-200',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      textColor: '#ffffff',
    };
  }

  // 6. Red / Crimson / Ruby / Volcanic / Explorer
  if (name.includes('red') || name.includes('crimson') || name.includes('ruby') || name.includes('volcanic')) {
    return {
      filter: 'hue-rotate(335deg) saturate(2.4) brightness(1.05) contrast(1.15)',
      tintOverlayColor: 'rgba(225, 29, 72, 0.48)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(244, 63, 94, 0.8)',
      accentGradient: 'from-rose-600 to-red-700',
      borderColor: 'rgba(244, 63, 94, 0.7)',
      textColor: '#fb7185',
    };
  }

  // 7. Green / Emerald / Mint / Razor / Teal / Matrix / Forest
  if (
    name.includes('green') ||
    name.includes('emerald') ||
    name.includes('mint') ||
    name.includes('razor') ||
    name.includes('teal') ||
    name.includes('matrix') ||
    name.includes('forest')
  ) {
    return {
      filter: 'hue-rotate(100deg) saturate(2.3) brightness(1.1) contrast(1.15)',
      tintOverlayColor: 'rgba(16, 185, 129, 0.48)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(16, 185, 129, 0.8)',
      accentGradient: 'from-emerald-500 to-teal-600',
      borderColor: 'rgba(16, 185, 129, 0.7)',
      textColor: '#34d399',
    };
  }

  // 8. Gold / Amber / Yellow / Desert / Champagne / Beige
  if (
    name.includes('gold') ||
    name.includes('amber') ||
    name.includes('yellow') ||
    name.includes('desert') ||
    name.includes('champagne') ||
    name.includes('beige') ||
    name.includes('wood')
  ) {
    return {
      filter: 'hue-rotate(38deg) saturate(2.2) brightness(1.12) contrast(1.12)',
      tintOverlayColor: 'rgba(245, 158, 11, 0.45)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(245, 158, 11, 0.8)',
      accentGradient: 'from-amber-400 to-yellow-600',
      borderColor: 'rgba(245, 158, 11, 0.7)',
      textColor: '#fbbf24',
    };
  }

  // 9. Orange / Sunset / Peach / Bronze / Copper / Sepia
  if (
    name.includes('orange') ||
    name.includes('sunset') ||
    name.includes('peach') ||
    name.includes('bronze') ||
    name.includes('copper') ||
    name.includes('sepia') ||
    name.includes('brown')
  ) {
    return {
      filter: 'hue-rotate(15deg) saturate(2.3) brightness(1.08) contrast(1.15)',
      tintOverlayColor: 'rgba(234, 88, 12, 0.48)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(249, 115, 22, 0.8)',
      accentGradient: 'from-orange-500 to-amber-600',
      borderColor: 'rgba(249, 115, 22, 0.7)',
      textColor: '#fdba74',
    };
  }

  // 10. Purple / Violet / Splatoon / Lavender / Pink / Rose
  if (
    name.includes('purple') ||
    name.includes('violet') ||
    name.includes('splatoon') ||
    name.includes('lavender') ||
    name.includes('pink') ||
    name.includes('rose') ||
    name.includes('pastel')
  ) {
    return {
      filter: 'hue-rotate(265deg) saturate(2.3) brightness(1.1) contrast(1.15)',
      tintOverlayColor: 'rgba(168, 85, 247, 0.48)',
      tintBlendMode: 'color',
      tintOpacity: 0.45,
      glowColor: 'rgba(168, 85, 247, 0.8)',
      accentGradient: 'from-purple-500 to-pink-600',
      borderColor: 'rgba(168, 85, 247, 0.7)',
      textColor: '#c084fc',
    };
  }

  // Default fallback using direct hex
  return {
    filter: 'contrast(1.1)',
    tintOverlayColor: hex,
    tintBlendMode: 'color',
    tintOpacity: 0.4,
    glowColor: hex,
    accentGradient: 'from-cyan-500 to-blue-600',
    borderColor: hex,
    textColor: '#ffffff',
  };
}
