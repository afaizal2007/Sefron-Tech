'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Boxes, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

export default function StockAuditModal() {
  const {
    isStockAuditModalOpen,
    setIsStockAuditModalOpen,
    products,
    updateProduct,
    bulkRestockAll,
  } = useStore();

  const [restockQty, setRestockQty] = useState(25);

  if (!isStockAuditModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#141824] border border-[#00e3fd]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e1f25] border border-[#00e3fd]/30 flex items-center justify-center text-[#00e3fd]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Inventory Stock Audit & Replenishment
              </h3>
              <p className="text-xs text-gray-400">
                Live warehouse counts and threshold allocations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsStockAuditModalOpen(false)}
            className="w-9 h-9 rounded-full bg-[#1e1f25] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Restock Bar */}
        <div className="p-4 rounded-2xl bg-[#0d0e13] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#00e3fd]" />
            <span className="text-xs font-semibold text-gray-300">
              Bulk Restock All Active Listings:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="500"
              value={restockQty}
              onChange={(e) => setRestockQty(Number(e.target.value))}
              className="w-20 px-3 py-1.5 rounded-xl bg-[#1e1f25] border border-white/15 text-white text-xs font-mono text-center focus:outline-none focus:border-[#00e3fd]"
            />
            <button
              type="button"
              onClick={() => bulkRestockAll(restockQty)}
              className="px-4 py-1.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Units</span>
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex flex-col gap-2.5 overflow-x-auto">
          {products.map((p) => {
            const isLow = p.stock <= 10;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#090a0f] border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#141824] overflow-hidden shrink-0 border border-white/10">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate font-['Outfit']">
                      {p.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {p.categoryLabel} • ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1.5">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> {p.stock} units
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {p.stock} units
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 5) })}
                      className="w-7 h-7 rounded-lg bg-[#1e1f25] hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center text-xs font-bold font-mono"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                      className="w-7 h-7 rounded-lg bg-[#1e1f25] hover:bg-[#00e3fd] hover:text-[#00285d] text-gray-300 flex items-center justify-center text-xs font-bold font-mono transition-colors"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProduct(p.id, { stock: p.stock + 50 })}
                      className="w-8 h-7 rounded-lg bg-[#1e1f25] hover:bg-[#3b82f6] hover:text-white text-gray-300 flex items-center justify-center text-xs font-bold font-mono transition-colors"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setIsStockAuditModalOpen(false)}
            className="px-6 py-2.5 rounded-full bg-[#1e1f25] hover:bg-[#292a2f] text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
