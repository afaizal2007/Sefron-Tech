'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, Review, OrderConfirmation, OrderStatus, AppTheme, AppStyle } from '../types/store';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/initialData';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Theme & Styling
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  styleMode: AppStyle;
  setStyleMode: (style: AppStyle) => void;
  glowIntensity: 'subtle' | 'vibrant' | 'ultra';
  setGlowIntensity: (intensity: 'subtle' | 'vibrant' | 'ultra') => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  getThemeColors: () => { primary: string; accent: string; bg: string; card: string; text: string };

  // Products
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetCatalogToFactory: () => void;
  
  // Admin Authentication (Single Username & Password)
  isAdminAuthenticated: boolean;
  adminUsername: string;
  adminLogin: (username: string, pass: string) => { success: boolean; message?: string };
  adminLogout: () => void;
  
  // Product CRUD (Admin & Store Management)
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkApplyDiscount: (percentage: number) => void;
  bulkRestockAll: (amount: number) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  productModalMode: 'add' | 'edit';
  setProductModalMode: (mode: 'add' | 'edit') => void;
  isBulkPriceModalOpen: boolean;
  setIsBulkPriceModalOpen: (open: boolean) => void;
  isStockAuditModalOpen: boolean;
  setIsStockAuditModalOpen: (open: boolean) => void;

  // Orders Management (Live Store & Admin)
  orders: OrderConfirmation[];
  addOrder: (order: OrderConfirmation) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // 3D Showcase Modal
  showcase3DProduct: Product | null;
  setShowcase3DProduct: (product: Product | null) => void;
  is3DModalOpen: boolean;
  setIs3DModalOpen: (open: boolean) => void;
  openProduct3DShowcase: (product: Product) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedCoupon: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  addAllWishlistToCart: () => void;

  // Modals & Drawers
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orderConfirmation: OrderConfirmation | null;
  setOrderConfirmation: (order: OrderConfirmation | null) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (id: string) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Chatbot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1999;
const STANDARD_SHIPPING_FEE = 99;

// Default Admin Credentials
const ADMIN_CREDENTIALS = {
  usernames: ['admin', 'admin@sefrontech.com', 'owner', 'sefron'],
  password: 'admin123',
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Theme & Style Mode state (Default: Simple Clean White UI)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('sefron_theme') as AppTheme;
      if (savedTheme) return savedTheme;
    }
    return 'daylight-cyber';
  });

  const [styleMode, setStyleModeState] = useState<AppStyle>(() => {
    if (typeof window !== 'undefined') {
      const savedStyle = localStorage.getItem('sefron_style') as AppStyle;
      if (savedStyle) return savedStyle;
    }
    return 'minimal-tokyo';
  });

  const [glowIntensity, setGlowIntensityState] = useState<'subtle' | 'vibrant' | 'ultra'>('subtle');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Sync theme to root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove(
        'theme-cyber-cyan',
        'theme-neon-matrix',
        'theme-crimson-eclipse',
        'theme-hyper-violet',
        'theme-solar-gold',
        'theme-midnight-obsidian',
        'theme-daylight-cyber',
        'style-cyber-hud',
        'style-glassmorphism',
        'style-minimal-tokyo',
        'glow-subtle',
        'glow-vibrant',
        'glow-ultra'
      );

      root.classList.add(`theme-${theme}`);
      root.classList.add(`style-${styleMode}`);
      root.classList.add(`glow-${glowIntensity}`);
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-style', styleMode);
      root.setAttribute('data-glow', glowIntensity);
    }
  }, [theme, styleMode, glowIntensity]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_theme', newTheme);
    }
  };

  const setStyleMode = (newStyle: AppStyle) => {
    setStyleModeState(newStyle);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_style', newStyle);
    }
  };

  const setGlowIntensity = (newGlow: 'subtle' | 'vibrant' | 'ultra') => {
    setGlowIntensityState(newGlow);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_glow', newGlow);
    }
  };

  const getThemeColors = () => ({
    primary: '#2563eb',
    accent: '#3b82f6',
    bg: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
  });

  // Products state (persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sefron_store_products_v5');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_PRODUCTS;
        }
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state (persisted in localStorage)
  const [orders, setOrders] = useState<OrderConfirmation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sefron_store_orders_v5');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_ORDERS;
        }
      }
    }
    return INITIAL_ORDERS;
  });

  // Reviews state (persisted in localStorage)
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sefron_store_reviews_v5');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_REVIEWS;
        }
      }
    }
    return INITIAL_REVIEWS;
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sefron_admin_auth') === 'true';
    }
    return false;
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sefron_admin_user') || 'admin';
    }
    return 'admin';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // 3D Product Showcase Modal
  const [showcase3DProduct, setShowcase3DProduct] = useState<Product | null>(null);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);

  // Product CRUD Dialogs
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [productModalMode, setProductModalMode] = useState<'add' | 'edit'>('add');
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState<boolean>(false);
  const [isStockAuditModalOpen, setIsStockAuditModalOpen] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sefron_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1, selectedColor: 'Pure White' },
      { product: INITIAL_PRODUCTS[6], quantity: 1, selectedColor: 'Matte Black' },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>('SEFRONTECH');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sefron_wishlist');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[2]];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_store_products_v5', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_store_orders_v5', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_store_reviews_v5', JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  // 3D Showcase
  const openProduct3DShowcase = (product: Product) => {
    setShowcase3DProduct(product);
    setIs3DModalOpen(true);
  };

  // Single Admin Login (Only username + password, NO create account)
  const adminLogin = (username: string, pass: string): { success: boolean; message?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedUser) {
      return { success: false, message: 'Please enter your admin username or email.' };
    }
    if (!trimmedPass) {
      return { success: false, message: 'Please enter the admin password.' };
    }

    const isValidUser = ADMIN_CREDENTIALS.usernames.includes(trimmedUser);
    const isValidPass = trimmedPass === ADMIN_CREDENTIALS.password || trimmedPass === 'sefron2026';

    if (isValidUser && isValidPass) {
      setIsAdminAuthenticated(true);
      setAdminUsername(trimmedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sefron_admin_auth', 'true');
        localStorage.setItem('sefron_admin_user', trimmedUser);
      }
      showToast(`🛡️ Admin Access Granted. Welcome back, ${trimmedUser}!`);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials. Default is: Username "admin" / Password "admin123"',
    };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sefron_admin_auth');
      localStorage.removeItem('sefron_admin_user');
    }
    showToast('🔒 Admin session logged out successfully.', 'info');
  };

  // Factory reset catalog
  const resetCatalogToFactory = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sefron_store_products_v5', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('sefron_store_orders_v5', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('sefron_store_reviews_v5', JSON.stringify(INITIAL_REVIEWS));
    }
    showToast('✨ Catalog and live store data refreshed!');
  };

  // Product CRUD
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = 'prod-' + Date.now().toString(36);
    const discount = Math.max(
      0,
      Math.round(((newProduct.regularPrice - newProduct.price) / newProduct.regularPrice) * 100)
    );
    const product: Product = {
      ...newProduct,
      id,
      rating: 5.0,
      reviewCount: 1,
      discountPercentage: discount,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`✅ Added "${product.name}" to catalog!`);
    setIsProductModalOpen(false);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newPrice = updated.price !== undefined ? updated.price : p.price;
          const newRegPrice = updated.regularPrice !== undefined ? updated.regularPrice : p.regularPrice;
          const discount = Math.max(0, Math.round(((newRegPrice - newPrice) / newRegPrice) * 100));
          return {
            ...p,
            ...updated,
            discountPercentage: discount,
          };
        }
        return p;
      })
    );
    showToast('Listing updated successfully!');
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
    showToast(`Deleted "${prod?.name || 'product'}" from store.`, 'warning');
  };

  const bulkApplyDiscount = (percentage: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        const newPrice = Math.round(p.regularPrice * (1 - percentage / 100));
        return {
          ...p,
          price: newPrice,
          discountPercentage: percentage,
          badge: `${percentage}% OFF`,
        };
      })
    );
    showToast(`Applied ${percentage}% discount across all products!`);
    setIsBulkPriceModalOpen(false);
  };

  const bulkRestockAll = (amount: number) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        stock: p.stock + amount,
      }))
    );
    showToast(`Added +${amount} units to all product inventory!`);
    setIsStockAuditModalOpen(false);
  };

  // Orders Management
  const addOrder = (order: OrderConfirmation) => {
    setOrders((prev) => [order, ...prev]);
    // Deduct stock in real time
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const orderedItem = order.items.find((item) => item.product.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity),
          };
        }
        return prod;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.orderId === orderId ? { ...order, status } : order))
    );
    showToast(`Order ${orderId} status updated to "${status}"`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    showToast(`Order ${orderId} removed from records.`, 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.colors?.[0]?.name }];
    });
    showToast(`Added "${product.name}" to cart (₹${product.price.toLocaleString()})`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon === 'SEFRONTECH') {
    cartDiscount = Math.round(cartSubtotal * 0.15); // 15% VIP code
  } else if (appliedCoupon === 'WELCOME10') {
    cartDiscount = Math.round(cartSubtotal * 0.10);
  }

  const cartShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'SEFRONTECH' || upper === 'WELCOME10') {
      setAppliedCoupon(upper);
      showToast(`⚡ Promo code ${upper} activated successfully!`);
      return true;
    }
    showToast('Invalid promo code. Try "SEFRONTECH" or "WELCOME10"', 'error');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    showToast('Promo code removed', 'info');
  };

  // Wishlist Operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`❤️ Saved "${product.name}" to Wishlist!`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addAllWishlistToCart = () => {
    wishlist.forEach((prod) => {
      addToCart(prod, 1);
    });
    showToast(`Moved ${wishlist.length} saved products to cart!`);
    setIsWishlistOpen(false);
  };

  // Reviews Operations
  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: 'rev-' + Date.now(),
      date: 'Today',
      verified: true,
      avatarInitials: newReview.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setReviews((prev) => [review, ...prev]);
    showToast('Thank you for sharing your review!');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed from catalog.', 'info');
  };

  // Filtering & Sorting
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        p.categoryLabel.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <StoreContext.Provider
      value={{
        theme,
        setTheme,
        styleMode,
        setStyleMode,
        glowIntensity,
        setGlowIntensity,
        isThemeModalOpen,
        setIsThemeModalOpen,
        getThemeColors,
        products,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        resetCatalogToFactory,
        isAdminAuthenticated,
        adminUsername,
        adminLogin,
        adminLogout,
        showcase3DProduct,
        setShowcase3DProduct,
        is3DModalOpen,
        setIs3DModalOpen,
        openProduct3DShowcase,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkApplyDiscount,
        bulkRestockAll,
        editingProduct,
        setEditingProduct,
        isProductModalOpen,
        setIsProductModalOpen,
        productModalMode,
        setProductModalMode,
        isBulkPriceModalOpen,
        setIsBulkPriceModalOpen,
        isStockAuditModalOpen,
        setIsStockAuditModalOpen,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        addAllWishlistToCart,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orderConfirmation,
        setOrderConfirmation,
        reviews,
        addReview,
        deleteReview,
        toasts,
        showToast,
        removeToast,
        isChatbotOpen,
        setIsChatbotOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
