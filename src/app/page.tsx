'use client';

import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryBrowser from '../components/CategoryBrowser';
import ProductCatalog from '../components/ProductCatalog';
import SpecialDeals from '../components/SpecialDeals';
import OrderTrackingSection from '../components/OrderTrackingSection';
import WhyUs from '../components/WhyUs';
import ReviewsSection from '../components/ReviewsSection';
import DeskGallery from '../components/DeskGallery';
import Footer from '../components/Footer';

// Interactive Drawers & Modals
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import SearchModal from '../components/SearchModal';
import QuickViewModal from '../components/QuickViewModal';
import CheckoutModal from '../components/CheckoutModal';
import ConciergeChat from '../components/ConciergeChat';

// Management Dialogs
import ProductModal from '../components/ProductModal';
import BulkPriceModal from '../components/BulkPriceModal';
import StockAuditModal from '../components/StockAuditModal';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col overflow-x-hidden">

      {/* 1. Header & VIP Strip */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full relative">

        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-100/40 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[2000px] -right-40 w-[600px] h-[600px] bg-sky-100/40 blur-[160px] rounded-full pointer-events-none -z-10" />

        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Category Browser Grid */}
        <CategoryBrowser />

        {/* 4. Curated Product Catalog */}
        <ProductCatalog />

        {/* 5. Special Deals & Flash Deals */}
        <SpecialDeals />

        {/* 6. Real-time User Order Tracking Section (Search by Mail or Phone) */}
        <OrderTrackingSection />

        {/* 7. Why Choose Us (SEFRON Tech Guarantee) */}
        <WhyUs />

        {/* 8. Verified Reviews & Testimonials */}
        <ReviewsSection />

        {/* 9. #ShotOnSEFRON Community Desk Feed */}
        <DeskGallery />
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Modals & Drawers Layer */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <QuickViewModal />
      <CheckoutModal />
      <ConciergeChat />

      {/* Product Management Dialogs */}
      <ProductModal />
      <BulkPriceModal />
      <StockAuditModal />
    </div>
  );
}
