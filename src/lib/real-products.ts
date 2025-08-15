import { spocketAPI } from './spocket-api';
import { aliExpressAPI } from './suppliers/aliexpress';
import { supplierTracker } from './supplier-performance';

// Enhanced product interface for real data
export interface RealProduct {
  id: string;
  spocketId?: string;
  aliexpressId?: string;
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
    performanceScore?: number; // Add supplier performance score
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
    qualityTier: 'Premium' | 'Luxury' | 'Ultra-Luxury'; // New tier system
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

// Product curation and enhancement engine
class RealProductEngine {
  private readonly LUXURY_KEYWORDS = [
    'premium', 'luxury', 'professional', 'artisan', 'handcrafted',
    'bespoke', 'exclusive', 'limited edition', 'designer', 'elite',
    'sophisticated', 'refined', 'heritage', 'exceptional', 'masterpiece'
  ];

  private readonly CATEGORY_MAPPING = {
    'Electronics': ['electronics', 'gadgets', 'tech', 'cameras', 'audio'],
    'Furniture': ['furniture', 'home decor', 'living room', 'bedroom', 'office'],
    'Outdoor Gear': ['outdoor', 'camping', 'hiking', 'sports', 'fitness'],
    'Kitchen Appliances': ['kitchen', 'appliances', 'cooking', 'coffee', 'food'],
    'Fitness Equipment': ['fitness', 'gym', 'exercise', 'wellness', 'health'],
    'Watches & Jewelry': ['watches', 'jewelry', 'accessories', 'luxury goods'],
    'Vehicles': ['automotive', 'cars', 'motorcycles', 'bikes', 'transport'],
    'Luxury Hobbies': ['art', 'collectibles', 'hobbies', 'crafts', 'music']
  };

  // Fetch and curate products from Spocket
  async fetchSpocketProducts(category?: string, limit: number = 50): Promise<RealProduct[]> {
    try {
      // Call with correct parameter object for spocket-api.ts
      const response = await spocketAPI.fetchProducts({
        category: category,
        per_page: limit
      });
      const spocketProducts = response.products || [];

      return spocketProducts.map((product: any) => this.enhanceSpocketProduct(product));
    } catch (error) {
      console.error('Error fetching Spocket products:', error);
      return [];
    }
  }

  // Fetch and curated products from AliExpress
  async fetchAliExpressProducts(category?: string, limit: number = 50): Promise<RealProduct[]> {
    try {
      // Call with correct parameters for aliexpress.ts
      const response = await aliExpressAPI.searchProducts('luxury', category, undefined, undefined, 1, limit);
      const aliProducts = response.products || [];

      return aliProducts.map((product: any) => this.enhanceAliExpressProduct(product));
    } catch (error) {
      console.error('Error fetching AliExpress products:', error);
      return [];
    }
  }

  // Enhanced product curation with luxury scoring and fallback
  async curateProductCatalog(): Promise<RealProduct[]> {
    try {
      const allProducts: RealProduct[] = [];

      // Get list of active (non-blacklisted) suppliers
      const activeSuppliers = supplierTracker.getActiveSuppliers();

      // Fetch from multiple sources with better error handling
      for (const category of Object.keys(this.CATEGORY_MAPPING).slice(0, 3)) { // Limit to first 3 categories
        try {
          // Get from Spocket (priority for luxury items)
          const spocketProducts = await this.fetchSpocketProducts(category, 5);
          // Filter by supplier performance
          const filteredSpocketProducts = await this.filterBySupplierPerformance(spocketProducts, 'spocket');
          allProducts.push(...filteredSpocketProducts);

          // Get from AliExpress (curated for quality)
          const aliProducts = await this.fetchAliExpressProducts(category, 3);
          // Filter by supplier performance
          const filteredAliProducts = await this.filterBySupplierPerformance(aliProducts, 'aliexpress');
          allProducts.push(...filteredAliProducts);

        } catch (error) {
          console.error(`Error curating ${category}:`, error);
          // Continue with other categories
        }
      }

      // If we have products, apply luxury curation and scoring with supplier performance
      if (allProducts.length > 0) {
        const candidateProducts = allProducts.filter(product => this.isLuxuryCandidate(product));

        // Process async supplier performance scoring
        const scoredProducts = await Promise.all(
          candidateProducts.map(product => this.calculateLuxuryScoreWithSupplierPerformance(product))
        );

        scoredProducts.sort((a, b) => b.luxury.qualityScore - a.luxury.qualityScore);

        // ENHANCED HYBRID STRATEGY: Multi-tier quality approach with supplier performance
        const ultraLuxury = scoredProducts.filter(p => p.luxury.qualityScore >= 85); // Ultra-Premium
        const luxury = scoredProducts.filter(p => p.luxury.qualityScore >= 75 && p.luxury.qualityScore < 85); // Premium
        const premium = scoredProducts.filter(p => p.luxury.qualityScore >= 60 && p.luxury.qualityScore < 75); // Quality

        // Combine with proper ratios: 20% ultra-luxury, 40% luxury, 40% premium
        const curatedProducts = [
          ...ultraLuxury.slice(0, 10),  // Top 10 ultra-luxury
          ...luxury.slice(0, 20),       // Top 20 luxury
          ...premium.slice(0, 20)       // Top 20 premium
        ];

        return curatedProducts; // Curated multi-tier catalog
      }

      // Fallback to empty array if no products found
      return [];
    } catch (error) {
      console.error('Error in product curation:', error);
      return []; // Return empty array for graceful fallback
    }
  }

  // Filter products by supplier performance
  private async filterBySupplierPerformance(products: RealProduct[], platform: 'spocket' | 'aliexpress'): Promise<RealProduct[]> {
    const filteredProducts: RealProduct[] = [];

    for (const product of products) {
      const supplierId = this.extractSupplierId(product, platform);

      // Check if supplier is blacklisted
      const isBlacklisted = !!supplierTracker.isBlacklisted(supplierId);

      if (!isBlacklisted) {
        filteredProducts.push(product);
      } else {
        console.log(`🚫 Product excluded - supplier ${supplierId} is blacklisted`);
      }
    }

    return filteredProducts;
  }

  // Enhanced luxury scoring with supplier performance
  private async calculateLuxuryScoreWithSupplierPerformance(product: RealProduct): Promise<RealProduct> {
    // Start with existing luxury scoring
    const enhancedProduct = this.calculateLuxuryScore(product);

    // Get supplier performance score
    const supplierId = this.extractSupplierId(product, this.getProductPlatform(product));
    const supplierReport = supplierTracker.getSupplierReport(supplierId);
    const supplierScore = supplierReport ? supplierTracker['calculateOverallScore'](supplierReport) : 75; // Default neutral score

    // Apply supplier performance to quality score
    const originalScore = enhancedProduct.luxury.qualityScore;
    const supplierWeight = 0.3; // 30% weight for supplier performance
    const productWeight = 0.7; // 70% weight for product attributes

    // Calculate weighted score
    const finalScore = Math.round(
      (originalScore * productWeight) + (supplierScore * supplierWeight)
    );

    // Update product with supplier-adjusted score
    enhancedProduct.luxury.qualityScore = Math.min(finalScore, 100);

    // Re-assign quality tier based on new score
    if (enhancedProduct.luxury.qualityScore >= 85) {
      enhancedProduct.luxury.qualityTier = 'Ultra-Luxury';
    } else if (enhancedProduct.luxury.qualityScore >= 75) {
      enhancedProduct.luxury.qualityTier = 'Luxury';
    } else {
      enhancedProduct.luxury.qualityTier = 'Premium';
    }

    // Add supplier performance metadata
    enhancedProduct.supplier.performanceScore = supplierScore;

    console.log(`📊 Product ${product.id}: Original score ${originalScore} → Final score ${finalScore} (Supplier: ${supplierScore})`);

    return enhancedProduct;
  }

  // Extract supplier ID from product
  private extractSupplierId(product: RealProduct, platform: 'spocket' | 'aliexpress'): string {
    if (platform === 'spocket' && product.spocketId) {
      return `spocket_${product.supplier.name}_${product.supplier.location}`.replace(/\s+/g, '_').toLowerCase();
    } else if (platform === 'aliexpress' && product.aliexpressId) {
      return `ali_${product.supplier.name}`.replace(/\s+/g, '_').toLowerCase();
    } else {
      // Fallback - create ID from supplier name and location
      return `${platform}_${product.supplier.name}_${product.supplier.location}`.replace(/\s+/g, '_').toLowerCase();
    }
  }

  // Determine product platform
  private getProductPlatform(product: RealProduct): 'spocket' | 'aliexpress' {
    if (product.spocketId) return 'spocket';
    if (product.aliexpressId) return 'aliexpress';
    return 'spocket'; // default fallback
  }

  private enhanceSpocketProduct(spocketProduct: any): RealProduct {
    const luxuryScore = this.calculateProductLuxuryScore(
      spocketProduct.name,
      spocketProduct.description,
      spocketProduct.price,
      spocketProduct.images?.length || 0
    );

    return {
      id: `spocket_${spocketProduct.id}`,
      spocketId: spocketProduct.id,
      name: this.enhanceProductName(spocketProduct.name),
      description: this.enhanceProductDescription(spocketProduct.description),
      price: this.calculateLuxuryPrice(spocketProduct.price),
      originalPrice: spocketProduct.compare_at_price || spocketProduct.price * 1.3,
      discountPercentage: Math.round(((spocketProduct.compare_at_price - spocketProduct.price) / spocketProduct.compare_at_price) * 100) || 15,
      images: spocketProduct.images || [],
      category: this.categorizeProduct(spocketProduct.name, spocketProduct.description),
      rating: this.generateRealisticRating(),
      reviewCount: this.generateReviewCount(spocketProduct.price),
      features: this.extractLuxuryFeatures(spocketProduct.description),
      specifications: this.generateSpecifications(spocketProduct),
      supplier: {
        name: spocketProduct.supplier?.name || 'Premium Supplier',
        location: spocketProduct.supplier?.location || 'United States',
        rating: 4.8,
        processingTime: '1-2 business days',
        shippingMethods: ['White-Glove Delivery', 'Express Shipping', 'Standard Shipping']
      },
      inventory: {
        inStock: true,
        quantity: Math.floor(Math.random() * 50) + 10,
        lowStockThreshold: 5
      },
      shipping: {
        freeShipping: true,
        estimatedDays: '3-5 business days',
        methods: [
          { name: 'White-Glove Service', price: 0, duration: '2-3 days' },
          { name: 'Express Delivery', price: 0, duration: '1-2 days' },
          { name: 'Standard Shipping', price: 0, duration: '3-5 days' }
        ]
      },
      luxury: {
        isLuxury: luxuryScore > 70,
        qualityScore: luxuryScore,
        qualityTier: luxuryScore >= 85 ? 'Ultra-Luxury' : luxuryScore >= 75 ? 'Luxury' : 'Premium',
        luxuryFeatures: this.generateLuxuryFeatures(spocketProduct),
        isLimitedEdition: luxuryScore > 85,
        isHandcrafted: luxuryScore > 80,
        provenance: luxuryScore > 90 ? 'Certified Authentic' : undefined
      },
      seo: {
        slug: this.generateSlug(spocketProduct.name),
        metaTitle: `${spocketProduct.name} - Luxury Collection | Vienora`,
        metaDescription: `Discover ${spocketProduct.name} in our exclusive luxury collection. Premium quality, verified authenticity, white-glove service.`,
        keywords: this.generateKeywords(spocketProduct.name, spocketProduct.description)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private enhanceAliExpressProduct(aliProduct: any): RealProduct {
    const luxuryScore = this.calculateProductLuxuryScore(
      aliProduct.title,
      aliProduct.description,
      aliProduct.price,
      aliProduct.images?.length || 0
    );

    return {
      id: `ali_${aliProduct.id}`,
      aliexpressId: aliProduct.id,
      name: this.enhanceProductName(aliProduct.title),
      description: this.enhanceProductDescription(aliProduct.description),
      price: this.calculateLuxuryPrice(aliProduct.price),
      originalPrice: aliProduct.original_price || aliProduct.price * 1.4,
      discountPercentage: aliProduct.discount_percentage || 20,
      images: aliProduct.images || [],
      category: this.categorizeProduct(aliProduct.title, aliProduct.description),
      rating: Math.min(aliProduct.rating || 4.5, 5.0),
      reviewCount: aliProduct.review_count || this.generateReviewCount(aliProduct.price),
      features: this.extractLuxuryFeatures(aliProduct.description),
      specifications: this.generateSpecifications(aliProduct),
      supplier: {
        name: 'Elite International Supplier',
        location: 'International',
        rating: 4.6,
        processingTime: '2-3 business days',
        shippingMethods: ['Express International', 'Standard International']
      },
      inventory: {
        inStock: true,
        quantity: aliProduct.stock || Math.floor(Math.random() * 30) + 5,
        lowStockThreshold: 3
      },
      shipping: {
        freeShipping: aliProduct.free_shipping || false,
        estimatedDays: '7-14 business days',
        methods: [
          { name: 'Express International', price: aliProduct.free_shipping ? 0 : 29, duration: '5-7 days' },
          { name: 'Standard International', price: aliProduct.free_shipping ? 0 : 15, duration: '10-14 days' }
        ]
      },
      luxury: {
        isLuxury: luxuryScore > 65,
        qualityScore: luxuryScore,
        qualityTier: luxuryScore >= 85 ? 'Ultra-Luxury' : luxuryScore >= 75 ? 'Luxury' : 'Premium',
        luxuryFeatures: this.generateLuxuryFeatures(aliProduct),
        isLimitedEdition: luxuryScore > 80,
        isHandcrafted: luxuryScore > 75,
        provenance: luxuryScore > 85 ? 'Quality Verified' : undefined
      },
      seo: {
        slug: this.generateSlug(aliProduct.title),
        metaTitle: `${aliProduct.title} - International Luxury | Vienora`,
        metaDescription: `Exclusive ${aliProduct.title} from our international luxury collection. Curated quality, global access.`,
        keywords: this.generateKeywords(aliProduct.title, aliProduct.description)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private calculateProductLuxuryScore(name: string, description: string, price: number, imageCount: number): number {
    let score = 0;

    // Name scoring
    const nameScore = this.LUXURY_KEYWORDS.reduce((acc, keyword) => {
      return acc + (name.toLowerCase().includes(keyword) ? 10 : 0);
    }, 0);

    // Description scoring
    const descScore = this.LUXURY_KEYWORDS.reduce((acc, keyword) => {
      return acc + (description?.toLowerCase().includes(keyword) ? 5 : 0);
    }, 0);

    // Price scoring (higher prices = more luxury potential)
    const priceScore = Math.min(price / 100 * 10, 30);

    // Image scoring (more images = better presentation)
    const imageScore = Math.min(imageCount * 3, 15);

    score = nameScore + descScore + priceScore + imageScore;
    return Math.min(score, 100);
  }

  private isLuxuryCandidate(product: RealProduct): boolean {
    return (
      product.price >= 50 && // Minimum luxury price threshold
      product.rating >= 4.0 && // Quality threshold
      product.luxury.qualityScore >= 50 && // Luxury score threshold
      product.images.length >= 2 // Visual requirement
    );
  }

  private calculateLuxuryScore(product: RealProduct): RealProduct {
    // Recalculate with additional factors
    let bonusScore = 0;

    if (product.supplier.location === 'United States') bonusScore += 10;
    if (product.shipping.freeShipping) bonusScore += 5;
    if (product.reviewCount > 100) bonusScore += 10;
    if (product.rating > 4.5) bonusScore += 10;

    product.luxury.qualityScore = Math.min(product.luxury.qualityScore + bonusScore, 100);
    product.luxury.isLuxury = product.luxury.qualityScore > 70;

    // Assign quality tier based on score
    if (product.luxury.qualityScore >= 85) {
      product.luxury.qualityTier = 'Ultra-Luxury';
    } else if (product.luxury.qualityScore >= 75) {
      product.luxury.qualityTier = 'Luxury';
    } else {
      product.luxury.qualityTier = 'Premium';
    }

    return product;
  }

  private enhanceProductName(name: string): string {
    // Enhance product names for luxury appeal
    const enhancements = {
      'camera': 'Professional Camera System',
      'headphones': 'Premium Audio Experience',
      'sofa': 'Luxury Seating Collection',
      'watch': 'Timepiece Masterpiece',
      'chair': 'Designer Furniture Piece'
    };

    let enhanced = name;
    for (const [key, value] of Object.entries(enhancements)) {
      if (name.toLowerCase().includes(key)) {
        enhanced = enhanced.replace(new RegExp(key, 'gi'), value);
        break;
      }
    }

    return enhanced;
  }

  private enhanceProductDescription(description: string): string {
    if (!description) return '';

    return `${description}

✨ Curated for discerning collectors who demand excellence
🏆 Verified authenticity and provenance
🚚 White-glove delivery service available
🔒 Comprehensive warranty and support
💎 Part of our exclusive luxury collection`;
  }

  private categorizeProduct(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();

    for (const [category, keywords] of Object.entries(this.CATEGORY_MAPPING)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'Luxury Hobbies'; // Default category
  }

  private generateRealisticRating(): number {
    // Generate ratings weighted towards higher scores for luxury items
    const weights = [0.05, 0.1, 0.15, 0.3, 0.4]; // Favor 4-5 stars
    const ratings = [1, 2, 3, 4, 5];

    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        // Add decimal precision
        return ratings[i] + (Math.random() * 0.9);
      }
    }

    return 4.5; // Fallback
  }

  private generateReviewCount(price: number): number {
    // Higher priced items typically have fewer but more detailed reviews
    const baseCount = Math.max(50, Math.floor(Math.random() * 500));
    const priceMultiplier = price > 1000 ? 0.3 : price > 500 ? 0.6 : 1;
    return Math.floor(baseCount * priceMultiplier);
  }

  private calculateLuxuryPrice(originalPrice: number): number {
    // Apply luxury markup while keeping competitive
    const markup = Math.random() * 0.3 + 1.2; // 20-50% markup
    return Math.round(originalPrice * markup);
  }

  private extractLuxuryFeatures(description: string): string[] {
    const features = [];

    if (description?.toLowerCase().includes('premium')) features.push('Premium Materials');
    if (description?.toLowerCase().includes('professional')) features.push('Professional Grade');
    if (description?.toLowerCase().includes('handmade')) features.push('Handcrafted');
    if (description?.toLowerCase().includes('limited')) features.push('Limited Edition');
    if (description?.toLowerCase().includes('warranty')) features.push('Extended Warranty');

    return features;
  }

  private generateLuxuryFeatures(product: any): string[] {
    const features = ['Provenance Verified', 'White-Glove Service'];

    if (product.price > 1000) features.push('VIP Exclusive');
    if (product.rating > 4.5) features.push('Curator Recommended');
    if (product.supplier?.location === 'United States') features.push('Domestic Luxury');

    return features;
  }

  private generateSpecifications(product: any): Record<string, string> {
    return {
      'Quality Grade': 'Premium',
      'Authenticity': 'Verified',
      'Shipping': 'White-Glove Available',
      'Support': '24/7 Concierge',
      'Warranty': 'Comprehensive Coverage'
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private generateKeywords(name: string, description: string): string[] {
    const words = `${name} ${description}`.toLowerCase().match(/\b\w+\b/g) || [];
    const keywords = [...new Set(words.filter(word => word.length > 3))];
    return keywords.slice(0, 10);
  }
}

// Singleton instance
export const realProductEngine = new RealProductEngine();

// Demo luxury products for fallback
const DEMO_LUXURY_PRODUCTS: RealProduct[] = [
  {
    id: 'demo-luxury-1',
    name: 'Professional 4K Digital Camera System',
    description: 'Ultra-premium camera system with museum-quality optics, handcrafted for discerning photographers who demand perfection.',
    price: 2899,
    originalPrice: 3299,
    discountPercentage: 12,
    images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'],
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 342,
    features: ['4K Video Recording', '45MP Sensor', 'Professional Grade', 'Weather Sealed'],
    specifications: { 'Quality Grade': 'Museum Quality', 'Authenticity': 'Verified' },
    supplier: { name: 'Elite Tech Masters', location: 'United States', rating: 4.9, processingTime: '1-2 days', shippingMethods: ['White-Glove'] },
    inventory: { inStock: true, quantity: 15, lowStockThreshold: 5 },
    shipping: { freeShipping: true, estimatedDays: '2-3 days', methods: [] },
    luxury: { isLuxury: true, qualityScore: 92, qualityTier: 'Ultra-Luxury' as const, luxuryFeatures: ['VIP Exclusive', 'Provenance Verified', 'Limited Edition'], isLimitedEdition: false, isHandcrafted: false },
    seo: { slug: 'professional-4k-camera', metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: '2025-01-13', updatedAt: '2025-01-13'
  },
  {
    id: 'demo-luxury-2',
    name: 'Premium Wireless Noise-Cancelling Headphones',
    description: 'Handcrafted audio masterpiece with proprietary drivers, delivering an immersive soundscape for the most discerning audiophiles.',
    price: 449,
    originalPrice: 549,
    discountPercentage: 18,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'],
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 1284,
    features: ['Active Noise Cancellation', '30hr Battery', 'Premium Audio', 'Handcrafted Design'],
    specifications: { 'Quality Grade': 'Audiophile', 'Authenticity': 'Verified' },
    supplier: { name: 'Audio Artisans', location: 'Germany', rating: 4.8, processingTime: '1-2 days', shippingMethods: ['Express'] },
    inventory: { inStock: true, quantity: 23, lowStockThreshold: 5 },
    shipping: { freeShipping: true, estimatedDays: '1-2 days', methods: [] },
    luxury: { isLuxury: true, qualityScore: 87, qualityTier: 'Ultra-Luxury' as const, luxuryFeatures: ['Curator Recommended', 'Limited Edition', 'Handcrafted'], isLimitedEdition: true, isHandcrafted: true },
    seo: { slug: 'premium-wireless-headphones', metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: '2025-01-13', updatedAt: '2025-01-13'
  },
  {
    id: 'demo-luxury-3',
    name: 'Luxury Italian Leather Sofa Collection',
    description: 'Handcrafted masterpiece from Tuscan artisans, featuring century-old techniques and the finest Italian leather for sophisticated interiors.',
    price: 3299,
    originalPrice: 4199,
    discountPercentage: 21,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
    category: 'Furniture',
    rating: 4.9,
    reviewCount: 189,
    features: ['Italian Leather', 'Hardwood Frame', 'Handcrafted', 'Lifetime Warranty'],
    specifications: { 'Quality Grade': 'Heritage', 'Authenticity': 'Certified' },
    supplier: { name: 'Tuscan Furniture Masters', location: 'Italy', rating: 4.9, processingTime: '2-3 weeks', shippingMethods: ['White-Glove'] },
    inventory: { inStock: true, quantity: 4, lowStockThreshold: 2 },
    shipping: { freeShipping: true, estimatedDays: '2-3 weeks', methods: [] },
    luxury: { isLuxury: true, qualityScore: 95, qualityTier: 'Ultra-Luxury' as const, luxuryFeatures: ['Handcrafted', 'Heritage Collection', 'Bespoke Options'], isLimitedEdition: false, isHandcrafted: true, provenance: 'Certified Authentic' },
    seo: { slug: 'luxury-italian-leather-sofa', metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: '2025-01-13', updatedAt: '2025-01-13'
  }
];

// Main functions for app integration with graceful fallbacks
export async function getCuratedProducts(category?: string, limit: number = 20): Promise<RealProduct[]> {
  try {
    const products = await realProductEngine.curateProductCatalog();
    if (products.length > 0) {
      return products.slice(0, limit);
    }
  } catch (error) {
    console.error('Error getting curated products:', error);
  }

  // Fallback to demo products
  const demoProducts = [...DEMO_LUXURY_PRODUCTS, ...DEMO_LUXURY_PRODUCTS.map(p => ({...p, id: p.id + '_dup'}))];
  return demoProducts.slice(0, limit);
}

export async function getProductsByCategory(category: string, limit: number = 12): Promise<RealProduct[]> {
  try {
    const products = await realProductEngine.curateProductCatalog();
    const categoryProducts = products.filter(p => p.category === category);
    if (categoryProducts.length > 0) {
      return categoryProducts.slice(0, limit);
    }
  } catch (error) {
    console.error('Error getting products by category:', error);
  }

  // Fallback to demo products filtered by category
  return DEMO_LUXURY_PRODUCTS.filter(p => p.category === category).slice(0, limit);
}

export async function getFeaturedProducts(limit: number = 6): Promise<RealProduct[]> {
  try {
    const products = await realProductEngine.curateProductCatalog();
    const featured = products.filter(p => p.luxury.qualityScore > 80);
    if (featured.length > 0) {
      return featured.slice(0, limit);
    }
  } catch (error) {
    console.error('Error getting featured products:', error);
  }

  // Fallback to demo products
  return DEMO_LUXURY_PRODUCTS.slice(0, limit);
}

export async function getProductById(id: string): Promise<RealProduct | null> {
  try {
    const products = await realProductEngine.curateProductCatalog();
    const found = products.find(p => p.id === id);
    if (found) return found;
  } catch (error) {
    console.error('Error getting product by ID:', error);
  }

  // Fallback to demo products
  return DEMO_LUXURY_PRODUCTS.find(p => p.id === id) || null;
}
