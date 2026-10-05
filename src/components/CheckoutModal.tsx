'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress, OrderConfirmation } from '../types/store';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Printer,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import SefronLogo from './SefronLogo';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    clearCart,
    orderConfirmation,
    setOrderConfirmation,
    addOrder,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98201 44552',
    addressLine: 'Apt 502, Prestige Tower, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARDS' | 'COD'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM'>('GPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePincodeChange = (pin: string) => {
    setAddress((prev) => ({ ...prev, pincode: pin }));
    if (pin === '560038' || pin === '560001') {
      setAddress((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
    } else if (pin === '400001' || pin === '400018') {
      setAddress((prev) => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
    } else if (pin === '110001') {
      setAddress((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
    } else if (pin === '500033' || pin === '500001') {
      setAddress((prev) => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const trackingNumber = 'SFN-IND-' + Math.floor(100000 + Math.random() * 900000);
      const orderId = 'ORD-SFN-' + Math.floor(1000 + Math.random() * 9000);

      const conf: OrderConfirmation = {
        orderId,
        trackingNumber,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        estimatedDelivery: 'within 48 Hours via Air Express',
        shippingAddress: address,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: cartShipping,
        total: cartTotal,
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiApp})` : paymentMethod === 'CARDS' ? 'Credit / Debit Card' : 'Cash on Delivery',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING_COD' : 'PAID',
        status: 'Processing',
      };

      // Add to store orders & decrement stock in real time
      addOrder(conf);
      setOrderConfirmation(conf);
      clearCart();
      setIsProcessing(false);
      setStep('success');

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#10b981', '#ffffff'],
        });
      } catch {}
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <SefronLogo className="w-10 h-10 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                {step === 'success'
                  ? 'Order Confirmed!'
                  : step === 'payment'
                  ? 'Secure Payment'
                  : 'Express Checkout'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'success'
                  ? 'Your order has been placed and received by our dispatch team'
                  : 'Fast priority air dispatch across India'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: SHIPPING ADDRESS DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Delivery & Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Rahul Sharma"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 98201 44552"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Email Address for Invoice *</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="rahul.sharma@example.com"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Street Address & Flat / House No *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  placeholder="Apt 502, Prestige Tower, Indiranagar"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="560038"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Bengaluru"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Karnataka"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Cart Summary Snippet */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Items Subtotal ({cart.length})</span>
                <span className="font-mono text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>VIP Coupon Discount</span>
                  <span className="font-mono">-₹{cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Express Shipping</span>
                <span className="font-mono font-semibold">
                  {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Payable</span>
                <span className="font-mono text-blue-600">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 'payment' && (
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Select Payment Method
            </span>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-blue-50/60 border-blue-600 text-blue-900 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">Instant UPI</span>
                  <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARDS')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'CARDS'
                    ? 'bg-blue-50/60 border-blue-600 text-blue-900 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">Cards / NetBanking</span>
                  <span className="text-[10px] text-slate-500">Visa, Master, RuPay</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-blue-50/60 border-blue-600 text-blue-900 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Pay at doorstep</span>
                </div>
              </button>
            </div>

            {/* UPI App Selection */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800">Select UPI Application:</span>
                <div className="flex gap-2">
                  {(['GPAY', 'PHONEPE', 'PAYTM'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        upiApp === app
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {app === 'GPAY' ? 'Google Pay' : app === 'PHONEPE' ? 'PhonePe' : 'Paytm UPI'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Total Pay Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Final Order Amount</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">
                  ₹{cartTotal.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteOrder}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <span>Processing Authorization...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay & Confirm Order (₹{cartTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === 'success' && orderConfirmation && (
          <div className="flex flex-col gap-6 items-center text-center py-4">
            
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your order <strong className="text-slate-900 font-mono">{orderConfirmation.orderId}</strong> is confirmed.
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-semibold text-slate-700">
                <span>Tracking Number:</span>
                <span className="font-mono text-blue-600 font-bold">{orderConfirmation.trackingNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Address:</span>
                <span className="font-medium text-slate-800 text-right">
                  {orderConfirmation.shippingAddress.fullName}, {orderConfirmation.shippingAddress.city}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-medium text-slate-800">{orderConfirmation.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Dispatch:</span>
                <span className="font-bold text-emerald-600">Air Express (within 48 hrs)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="font-mono text-blue-600">₹{orderConfirmation.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
