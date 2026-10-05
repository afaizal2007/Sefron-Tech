'use client';

import React from 'react';

interface SefronLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  showBadge?: boolean;
  animated?: boolean;
}

export default function SefronLogo({
  className = 'w-10 h-10',
  size,
  glow = false,
  animated = false,
}: SefronLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div
      style={style}
      className={`relative inline-flex items-center justify-center shrink-0 ${className} ${
        animated ? 'hover:scale-105 transition-transform duration-300' : ''
      }`}
    >
      <img
        src="/logo.png"
        alt="SEFRON Tech Logo"
        className="w-full h-full object-contain select-none filter drop-shadow-sm"
      />
    </div>
  );
}
