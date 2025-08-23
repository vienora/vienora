export interface VienoraProduct {
  id: string;
  spocketId?: string;
  aliexpressId?: string;
  printfulId?: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  images: string[];
  category: string;
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
    performanceScore: number;
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
    isLimitedEdition: boolean;
    isHandcrafted: boolean;
    provenance: string;
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

export interface ProductFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  qualityTier?: 'Premium' | 'Luxury' | 'Ultra-Luxury';
  inStock?: boolean;
  supplier?: string;
  limit?: number;
  offset?: number;
}

export interface SupplierPerformance {
  supplierId: string;
  name: string;
  totalOrders: number;
  successfulOrders: number;
  returnRate: number;
  qualityScore: number;
  responseTime: number;
  isBlacklisted: boolean;
  lastAssessment: string;
  performanceHistory: Array<{
    date: string;
    score: number;
    notes: string;
  }>;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories?: ProductCategory[];
}

export type QualityTier = 'Premium' | 'Luxury' | 'Ultra-Luxury';
export type ProductSource = 'printful' | 'spocket' | 'modalyst' | 'demo';
