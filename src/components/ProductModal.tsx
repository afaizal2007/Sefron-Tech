'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types/store';
import { X, Package } from 'lucide-react';

const STUDIO_PRESETS = [
  {
    label: 'Apple iPhone 16 Pro',
    url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    category: 'Mobiles',
  },
  {
    label: 'Apple AirPods Pro',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
    category: 'Audio',
  },
  {
    label: 'Sony WH-1000XM5',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    category: 'Audio',
  },
  {
    label: 'Sony PlayStation 5',
    url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    category: 'Gaming',
  },
  {
    label: 'Apple Watch Ultra 2',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    category: 'Wearables',
  },
  {
    label: 'Anker GaN Fast Charger',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop',
    category: 'Power',
  },
  {
    label: 'Pitaka Magnetic Case',
    url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1000&auto=format&fit=crop',
    category: 'Protection',
  },
  {
    label: 'Marshall Portable Speaker',
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
    category: 'Speakers',
  },
];

const CATEGORIES: ProductCategory[] = [
  'Gaming',
  'Mobiles',
  'Audio',
  'Wearables',
  'Speakers',
  'Power',
  'Protection',
  'Cables',
];

interface ProductFormProps {
  mode: 'add' | 'edit';
  editingProduct: Product | null;
  onClose: () => void;
}

function ProductModalForm({ mode, editingProduct, onClose }: ProductFormProps) {
  const { addProduct, updateProduct, showToast } = useStore();

  const isEdit = mode === 'edit' && !!editingProduct;

  const [name, setName] = useState(isEdit ? editingProduct.name : '');
  const [category, setCategory] = useState<ProductCategory>(
    isEdit ? editingProduct.category : 'Audio'
  );
  const [price, setPrice] = useState(isEdit ? editingProduct.price.toString() : '');
  const [regularPrice, setRegularPrice] = useState(
    isEdit ? editingProduct.regularPrice.toString() : ''
  );
  const [stock, setStock] = useState(isEdit ? editingProduct.stock.toString() : '25');
  const [badge, setBadge] = useState(isEdit ? editingProduct.badge || '' : 'New');
  const [tagline, setTagline] = useState(
    isEdit ? editingProduct.tagline || '' : 'Next-Gen Performance'
  );
  const [description, setDescription] = useState(
    isEdit ? editingProduct.description || '' : ''
  );
  const [imageUrl, setImageUrl] = useState(
    isEdit ? editingProduct.imageUrl : STUDIO_PRESETS[0].url
  );
  const [featuresText, setFeaturesText] = useState(
    isEdit
      ? editingProduct.features?.join('\n') || ''
      : 'Flagship performance\nPrecision engineered chassis\n1-Year official warranty'
  );
  const [specsText, setSpecsText] = useState(
    isEdit
      ? Object.entries(editingProduct.specs || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : 'Connectivity: USB-C / Wireless\nWarranty: 1 Year Comprehensive'
  );
  const [isFeatured, setIsFeatured] = useState(
    isEdit ? Boolean(editingProduct.isFeatured) : true
  );
  const [isFlashDeal, setIsFlashDeal] = useState(
    isEdit ? Boolean(editingProduct.isFlashDeal) : false
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }

    const numPrice = parseFloat(price) || 999;
    const numRegularPrice = parseFloat(regularPrice) || numPrice;
    const numStock = parseInt(stock, 10) || 0;

    const specsObj: { [key: string]: string } = {};
    specsText.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) specsObj[key] = val;
      }
    });

    const featuresList = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const categoryLabels: { [key in ProductCategory]: string } = {
      Gaming: 'Gaming Consoles',
      Mobiles: 'Flagship Mobiles',
      Audio: 'Audio & Earbuds',
      Wearables: 'Smart Watches',
      Speakers: 'Audio Speakers',
      Power: 'Power & Chargers',
      Protection: 'Mobile Protection',
      Cables: 'Cables & Docks',
    };

    if (mode === 'add') {
      addProduct({
        name: name.trim(),
        category,
        categoryLabel: categoryLabels[category] || category,
        price: numPrice,
        regularPrice: Math.max(numPrice, numRegularPrice),
        discountPercentage: Math.max(
          0,
          Math.round(((numRegularPrice - numPrice) / numRegularPrice) * 100)
        ),
        rating: 5.0,
        reviewCount: 1,
        stock: numStock,
        badge: badge.trim() || undefined,
        tagline: tagline.trim() || 'Premium Electronics',
        description:
          description.trim() ||
          'High-performance flagship device with manufacturer warranty.',
        specs: specsObj,
        features:
          featuresList.length > 0
            ? featuresList
            : ['High-performance flagship device'],
        imageUrl: imageUrl.trim() || STUDIO_PRESETS[0].url,
        isFeatured,
        isFlashDeal,
      });
    } else if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        category,
        categoryLabel: categoryLabels[category] || category,
        price: numPrice,
        regularPrice: Math.max(numPrice, numRegularPrice),
        stock: numStock,
        badge: badge.trim() || undefined,
        tagline: tagline.trim(),
        description: description.trim(),
        specs: specsObj,
        features: featuresList,
        imageUrl: imageUrl.trim(),
        isFeatured,
        isFlashDeal,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                {mode === 'add' ? 'Add Product to Catalog' : 'Edit Product'}
              </h3>
              <p className="text-xs text-slate-500">Live inventory synchronization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple AirPods Pro (2nd Gen)"
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller or 20% OFF"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">MRP / Regular Price (₹)</label>
              <input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="3999"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Stock Units *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product summary and details..."
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductModal() {
  const {
    isProductModalOpen,
    setIsProductModalOpen,
    productModalMode,
    editingProduct,
  } = useStore();

  if (!isProductModalOpen) return null;

  return (
    <ProductModalForm
      key={productModalMode === 'edit' ? editingProduct?.id || 'edit' : 'new'}
      mode={productModalMode}
      editingProduct={editingProduct}
      onClose={() => setIsProductModalOpen(false)}
    />
  );
}
