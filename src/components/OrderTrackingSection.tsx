'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderConfirmation, OrderStatus } from '../types/store';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Printer,
  ChevronRight,
  ShieldCheck,
  Headphones,
  RotateCcw,
  X,
  ExternalLink,
} from 'lucide-react';

export default function OrderTrackingSection() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderConfirmation | null>(null);

  // Filter orders matching phone number, email, or orderId
  const matchingOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    
    // Clean phone numbers by removing spaces, hyphens, and +91
    const cleanQ = q.replace(/[\s\-\+\(\)]/g, '');

    return orders.filter((order) => {
      const orderIdMatch = order.orderId.toLowerCase().includes(q);
      const trackingMatch = (order.trackingNumber || '').toLowerCase().includes(q);
      const emailMatch = order.shippingAddress?.email?.toLowerCase().includes(q);
      const nameMatch = order.shippingAddress?.fullName?.toLowerCase().includes(q);
      
      const rawPhone = (order.shippingAddress?.phone || '').replace(/[\s\-\+\(\)]/g, '');
      const phoneMatch = rawPhone.includes(cleanQ) || (cleanQ.length >= 4 && rawPhone.endsWith(cleanQ));

      return orderIdMatch || trackingMatch || emailMatch || nameMatch || phoneMatch;
    });
  }, [orders, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearched(true);
    }
  };

  const handleQuickFill = (val: string) => {
    setSearchQuery(val);
    setSearched(true);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 2;
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <section id="track-order" className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
        
        {/* Header Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-Time Express Tracking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Track Your Order
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Enter the <strong className="text-slate-900">Email Address</strong> or <strong className="text-slate-900">Phone Number</strong> you provided when placing your order to check live status, courier milestones, and delivery estimates.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Email (e.g. rahul@...) or Phone (e.g. 9876543210)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearched(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Order</span>
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Quick Test:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('rahul.verma@example.com')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-mono hover:text-blue-600 transition-colors shadow-2xs"
            >
              rahul.verma@example.com
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('9876543210')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-mono hover:text-blue-600 transition-colors shadow-2xs"
            >
              +91 98765 43210
            </button>
          </div>
        </div>

        {/* Results Area */}
        {searched && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {matchingOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center flex flex-col items-center gap-3 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  We couldn&apos;t find any orders matching <strong className="text-slate-800 font-mono">&ldquo;{searchQuery}&rdquo;</strong>. Please check the spelling or try entering the phone number used during checkout.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Clear Search
                  </button>
                  <a
                    href="#footer"
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            ) : (
              matchingOrders.map((order) => {
                const step = getStatusStepIndex(order.status);
                const isCancelled = order.status === 'Cancelled';

                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md flex flex-col gap-6"
                  >
                    {/* Top Row: Order ID, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
                          <span className="font-mono font-extrabold text-blue-600 text-base">
                            #{order.orderId}
                          </span>
                          {order.trackingNumber && (
                            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              AWB: {order.trackingNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {order.createdAt}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            {order.paymentMethod} ({order.paymentStatus || 'PAID'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'Processing'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          ● Status: {order.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          title="View & Print Official Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Progress Timeline */}
                    {!isCancelled ? (
                      <div className="py-3 px-2 sm:px-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="relative flex items-center justify-between">
                          {/* Progress Line */}
                          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
                            <div
                              className="h-full bg-blue-600 transition-all duration-500"
                              style={{
                                width:
                                  step === 1 ? '10%' : step === 2 ? '40%' : step === 3 ? '75%' : '100%',
                              }}
                            />
                          </div>

                          {/* Step 1 */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                step >= 1
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white border border-slate-300 text-slate-400'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">Confirmed</span>
                            <span className="text-[9px] text-slate-400 hidden sm:inline">Payment Verified</span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                step >= 2
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white border border-slate-300 text-slate-400'
                              }`}
                            >
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">Processing</span>
                            <span className="text-[9px] text-slate-400 hidden sm:inline">Packed & QC Pass</span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                step >= 3
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white border border-slate-300 text-slate-400'
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">In Transit</span>
                            <span className="text-[9px] text-slate-400 hidden sm:inline">Bluedart Air Express</span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                step >= 4
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white border border-slate-300 text-slate-400'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800">Delivered</span>
                            <span className="text-[9px] text-slate-400 hidden sm:inline">Signed by Customer</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>This order was cancelled. If you requested a refund, it will be credited back within 3-5 business days.</span>
                      </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                      
                      {/* Left: Purchased Items */}
                      <div className="md:col-span-7 flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Purchased Items ({order.items.length})
                        </h4>
                        <div className="flex flex-col gap-2.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 gap-3"
                            >
                              <div className="flex items-center gap-3">
                                {item.product?.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 text-xs line-clamp-1">
                                    {item.product?.name || 'Product Item'}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    Color: <strong className="text-slate-700">{item.selectedColor || 'Standard'}</strong> • Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold font-mono text-slate-900 text-xs shrink-0">
                                ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Shipping & Price Breakdown */}
                      <div className="md:col-span-5 flex flex-col justify-between gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                        <div className="flex flex-col gap-2.5">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>Delivery Destination</span>
                          </h4>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.addressLine}</p>
                            <p>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              📞 {order.shippingAddress?.phone} • ✉️ {order.shippingAddress?.email}
                            </p>
                          </div>
                        </div>

                        {/* Price Summary */}
                        <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-1 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-mono font-semibold">₹{order.subtotal.toLocaleString()}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-semibold">
                              <span>Discount</span>
                              <span className="font-mono">-₹{order.discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-500">
                            <span>Shipping</span>
                            <span className="font-mono font-semibold">
                              {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                            <span>Grand Total</span>
                            <span className="font-mono text-blue-600">₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Invoice Modal for Customer */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Header / Close */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 font-['Outfit']">
                  SEFRON <span className="text-blue-600">TECH</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">/ Tax Invoice</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Area */}
            <div className="flex flex-col gap-6 py-4">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-slate-800">Billed To:</p>
                  <p className="font-semibold text-slate-900">{selectedOrderForInvoice.shippingAddress.fullName}</p>
                  <p className="text-slate-600">{selectedOrderForInvoice.shippingAddress.addressLine}</p>
                  <p className="text-slate-600">
                    {selectedOrderForInvoice.shippingAddress.city}, {selectedOrderForInvoice.shippingAddress.state} - {selectedOrderForInvoice.shippingAddress.pincode}
                  </p>
                  <p className="text-slate-600">Phone: {selectedOrderForInvoice.shippingAddress.phone}</p>
                  <p className="text-slate-600">Email: {selectedOrderForInvoice.shippingAddress.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Invoice Details:</p>
                  <p className="font-mono text-blue-600 font-bold">#{selectedOrderForInvoice.orderId}</p>
                  <p className="text-slate-500">Date: {selectedOrderForInvoice.createdAt}</p>
                  <p className="text-slate-500">Status: {selectedOrderForInvoice.status}</p>
                  <p className="text-slate-500">Payment: {selectedOrderForInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderForInvoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{item.product?.name || 'Item'}</span>
                          <span className="text-[10px] text-slate-400 block">Finish: {item.selectedColor || 'Standard'}</span>
                        </td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">₹{item.product?.price.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-56 flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold">₹{selectedOrderForInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-mono">{selectedOrderForInvoice.shippingFee === 0 ? 'FREE' : `₹${selectedOrderForInvoice.shippingFee}`}</span>
                  </div>
                  {selectedOrderForInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-₹{selectedOrderForInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                    <span>Grand Total</span>
                    <span className="font-mono text-blue-600">₹{selectedOrderForInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={printInvoice}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
