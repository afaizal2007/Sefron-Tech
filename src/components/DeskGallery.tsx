'use client';

import React, { useState } from 'react';
import { COMMUNITY_GALLERY } from '../data/initialData';
import { Camera, Heart } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function DeskGallery() {
  const [likesState, setLikesState] = useState<{ [key: string]: { count: number; liked: boolean } }>({
    'post-1': { count: 1840, liked: false },
    'post-2': { count: 1280, liked: false },
    'post-3': { count: 2790, liked: false },
    'post-4': { count: 3410, liked: false },
  });

  const toggleLike = (postId: string) => {
    setLikesState((prev) => {
      const current = prev[postId] || { count: 100, liked: false };
      const nextLiked = !current.liked;
      return {
        ...prev,
        [postId]: {
          count: nextLiked ? current.count + 1 : current.count - 1,
          liked: nextLiked,
        },
      };
    });
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
              COMMUNITY CURATION
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              #ShotOnSEFRON Minimalist Workstations
            </h3>
          </div>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow"
        >
          <InstagramIcon className="w-4 h-4 text-pink-600" />
          <span>Follow @sefrontech.official →</span>
        </a>
      </div>

      {/* 4 Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {COMMUNITY_GALLERY.map((item) => {
          const state = likesState[item.id] || { count: item.likes, liked: false };
          return (
            <div
              key={item.id}
              className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between backdrop-blur-sm text-white">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-blue-400 font-bold">
                    {item.author}
                  </span>
                  <span className="text-xs text-slate-200 line-clamp-2">
                    {item.caption}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleLike(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white hover:text-pink-400 transition-colors shadow-sm"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${state.liked ? 'text-pink-500 fill-pink-500' : 'text-white'}`}
                    />
                    <span className="text-xs font-mono font-bold">{state.count}</span>
                  </button>

                  <span className="text-[10px] font-mono text-slate-300">Instagram</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
