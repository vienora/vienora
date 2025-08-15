// Product type definitions for Vienora luxury platform

export interface VienoraProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  images: string[];
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  supplier: {
    name: string;
    location: string;
    rating: number;
    processingTime: string;
    shippingMethods: string[];
    performanceScore?: number;
  };
  inventory: {
    inStock: boolean;
    quantity: number;
    lowStockThreshold: number;
  };
  shipping: {
    freeShipping: boolean;
    estimatedDays: string;
    methods: Array<{
      name: string;
      price: number;
      duration: string;
    }>;
  };
  luxury: {
    isLuxury: boolean;
    qualityScore: number;
    qualityTier: 'Premium' | 'Luxury' | 'Ultra-Luxury';
    luxuryFeatures: string[];
    certification?: string;
    isLimitedEdition: boolean;
    isHandcrafted: boolean;
    provenance?: string;
  };
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Cart item type
export interface CartItem {
  product: VienoraProduct;
  quantity: number;
  selectedVariant?: string;
}

// Order type
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  membershipTier: 'elite' | 'prestige' | 'sovereign';
  joinedAt: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

// Search filters type
export interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  features: string[];
  availability: string[];
  sortBy: string;
}
