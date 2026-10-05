export type AppTheme = 
  | 'daylight-cyber'
  | 'cyber-cyan' 
  | 'neon-matrix' 
  | 'crimson-eclipse' 
  | 'hyper-violet' 
  | 'solar-gold' 
  | 'midnight-obsidian';

export type AppStyle = 
  | 'minimal-tokyo'
  | 'glassmorphism' 
  | 'cyber-hud';

export type ProductCategory = 
  | 'Gaming' 
  | 'Mobiles' 
  | 'Audio' 
  | 'Protection' 
  | 'Power' 
  | 'Wearables' 
  | 'Cables' 
  | 'Speakers';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  regularPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  tagline: string;
  description: string;
  specs: { [key: string]: string };
  features: string[];
  imageUrl: string;
  colors?: { name: string; hex: string; inStock: boolean; imageUrl?: string }[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
}

export interface OwnerAccount {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  role: 'Store Owner' | 'Inventory Lead' | 'Administrator';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  userRole: string;
  productName: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
  avatarInitials: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderConfirmation {
  orderId: string;
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING_COD';
  status: OrderStatus;
}

/**
 * Checks if 3D WebGL Studio view is supported for a product.
 * Chargers, power banks, and cables are excluded from 3D view.
 */
export const is3DSupported = (product?: Product | null): boolean => {
  if (!product) return false;
  if (product.category === 'Power' || product.category === 'Cables') return false;
  const name = product.name.toLowerCase();
  if (
    name.includes('charger') ||
    name.includes('power bank') ||
    name.includes('powerbank') ||
    name.includes('power core') ||
    name.includes('charging hub') ||
    name.includes('charging station') ||
    name.includes('gan') ||
    name.includes('cable') ||
    name.includes('adapter')
  ) {
    return false;
  }
  return true;
};
