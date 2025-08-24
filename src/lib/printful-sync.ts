import { printfulAPI } from './printful-api';
import { VienoraProduct, QualityTier } from './types';

interface PrintfulToVienoraMapping {
  printfulId: number;
  name: string;
  category: string;
  basePrice: number;
  luxuryMarkup: number;
  vienoraPrice: number;
  description: string;
  images: string[];
  features: string[];
}

class PrintfulSync {
  private readonly LUXURY_MARKUP = 2.5; // 150% markup for luxury positioning
  private readonly CATEGORY_MAPPING: Record<number, string> = {
    // Apparel
    71: 'Luxury Apparel', // T-shirts
    18: 'Luxury Apparel', // Hoodies
    24: 'Luxury Apparel', // Tank tops
    420: 'Luxury Apparel', // Long sleeve
    21: 'Luxury Apparel', // Premium shirts

    // Accessories
    26: 'Luxury Accessories', // Bags
    172: 'Luxury Accessories', // Backpacks
    194: 'Luxury Accessories', // Fanny packs
    242: 'Tech Accessories', // Phone cases
    390: 'Tech Accessories', // Laptop sleeves

    // Home & Living
    19: 'Luxury Home', // Mugs
    27: 'Luxury Home', // Posters (changed from 26 to avoid duplicate)
    173: 'Luxury Home', // Canvas prints
    37: 'Luxury Home', // Pillows
    38: 'Luxury Home', // Blankets

    // Stationery & Office
    55: 'Office & Stationery', // Notebooks
    413: 'Office & Stationery', // Stickers
  };

  async fetchAndTransformProducts(limit = 20): Promise<VienoraProduct[]> {
    try {
      console.log('🔄 Fetching products from Printful...');

      // Check if API is configured
      if (!process.env.PRINTFUL_API_KEY) {
        console.log('⚠️ Printful API key not configured, returning demo products');
        return this.getDemoLuxuryProducts(limit);
      }

      // Test API connection first
      const isConnected = await printfulAPI.testConnection();
      if (!isConnected) {
        console.log('❌ Printful API connection failed, returning demo products');
        return this.getDemoLuxuryProducts(limit);
      }

      // Get catalog products (available for customization)
      const catalogProducts = await printfulAPI.getCatalogProducts();

      // Filter for luxury-appropriate products
      const luxuryProducts = catalogProducts.filter(product =>
        !product.is_discontinued &&
        parseFloat(product.retail_price) >= 15 && // Minimum price threshold
        this.isLuxuryCategory(product.id)
      );

      console.log(`📦 Found ${luxuryProducts.length} luxury-appropriate products`);

      // Transform to Vienora format
      const vienoraProducts = await Promise.all(
        luxuryProducts.slice(0, limit).map(product => this.transformToVienoraProduct(product))
      );

      console.log(`✅ Transformed ${vienoraProducts.length} products for Vienora`);
      return vienoraProducts;

    } catch (error) {
      console.error('❌ Error fetching Printful products:', error);
      console.log('📦 Falling back to demo products');
      return this.getDemoLuxuryProducts(limit);
    }
  }

  private isLuxuryCategory(productId: number): boolean {
    return Object.keys(this.CATEGORY_MAPPING).includes(productId.toString());
  }

  private async transformToVienoraProduct(printfulProduct: any): Promise<VienoraProduct> {
    const basePrice = parseFloat(printfulProduct.retail_price);
    const vienoraPrice = Math.round(basePrice * this.LUXURY_MARKUP);
    const originalPrice = Math.round(vienoraPrice * 1.2); // Show 20% "discount"

    return {
      id: `printful_${printfulProduct.id}`,
      printfulId: printfulProduct.id,
      name: this.enhanceName(printfulProduct.title),
      description: this.createLuxuryDescription(printfulProduct),
      price: vienoraPrice,
      originalPrice: originalPrice,
      discountPercentage: Math.round(((originalPrice - vienoraPrice) / originalPrice) * 100),
      images: [printfulProduct.image],
      category: this.CATEGORY_MAPPING[printfulProduct.id] || 'Luxury Accessories',
      rating: this.generateRating(),
      reviewCount: this.generateReviewCount(vienoraPrice),
      features: this.extractFeatures(printfulProduct),
      specifications: this.generateSpecs(printfulProduct),
      supplier: {
        name: 'Printful Premium',
        location: 'United States',
        rating: 4.9,
        processingTime: '2-4 business days',
        shippingMethods: ['Express', 'Standard'],
        performanceScore: 95
      },
      inventory: {
        inStock: true,
        quantity: 999, // Printful handles inventory
        lowStockThreshold: 10
      },
      shipping: {
        freeShipping: vienoraPrice >= 75,
        estimatedDays: '3-7 business days',
        methods: [
          { name: 'Standard Shipping', price: vienoraPrice >= 75 ? 0 : 9.99, duration: '5-7 days' },
          { name: 'Express Shipping', price: 19.99, duration: '3-4 days' }
        ]
      },
      luxury: {
        isLuxury: true,
        qualityScore: this.calculateLuxuryScore(printfulProduct, vienoraPrice),
        qualityTier: this.assignQualityTier(vienoraPrice),
        luxuryFeatures: this.generateLuxuryFeatures(printfulProduct),
        isLimitedEdition: false,
        isHandcrafted: true,
        provenance: 'Printful Certified'
      },
      seo: {
        slug: this.generateSlug(printfulProduct.title),
        metaTitle: `${this.enhanceName(printfulProduct.title)} - Vienora Luxury Collection`,
        metaDescription: `Discover premium ${printfulProduct.title} in our exclusive luxury collection. Custom designed, premium materials, fast shipping.`,
        keywords: this.generateKeywords(printfulProduct)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private enhanceName(originalName: string): string {
    const enhancements: Record<string, string> = {
      'T-Shirt': 'Premium Custom T-Shirt',
      'Hoodie': 'Luxury Custom Hoodie',
      'Mug': 'Artisan Custom Mug',
      'Poster': 'Premium Art Print',
      'Pillow': 'Luxury Custom Pillow',
      'Phone Case': 'Premium Custom Phone Case',
      'Tote Bag': 'Luxury Custom Tote Bag',
      'Tank Top': 'Premium Custom Tank Top',
      'Long Sleeve': 'Luxury Long Sleeve Shirt'
    };

    let enhanced = originalName;
    for (const [key, value] of Object.entries(enhancements)) {
      if (originalName.includes(key)) {
        enhanced = originalName.replace(key, value);
        break;
      }
    }

    return `Vienora ${enhanced}`;
  }

  private createLuxuryDescription(product: any): string {
    return `${product.description || 'Premium custom product crafted with attention to detail.'}

✨ **Vienora Luxury Collection**
🎨 **Custom Design Options Available**
🏭 **Premium Manufacturing Standards**
📦 **Luxury Packaging Included**
🚚 **Fast & Reliable Shipping**
🔒 **Quality Guarantee**

Transform your style with this exclusive piece from our curated luxury collection. Each item is made-to-order with premium materials and meticulous attention to detail.

*Part of the exclusive Vienora lifestyle collection - where luxury meets personalization.*`;
  }

  private calculateLuxuryScore(product: any, price: number): number {
    let score = 70; // Base luxury score

    // Price factor (higher price = more luxury appeal)
    if (price >= 100) score += 15;
    else if (price >= 50) score += 10;
    else if (price >= 25) score += 5;

    // Product type factor
    const luxuryTypes = ['Hoodie', 'Pillow', 'Canvas', 'Poster'];
    if (luxuryTypes.some(type => product.title.includes(type))) score += 10;

    // Customization factor
    if (product.files && product.files.length > 0) score += 10;

    return Math.min(score, 100);
  }

  private assignQualityTier(price: number): QualityTier {
    if (price >= 100) return 'Ultra-Luxury';
    if (price >= 50) return 'Luxury';
    return 'Premium';
  }

  private generateLuxuryFeatures(product: any): string[] {
    const features = ['Custom Design', 'Premium Materials', 'Vienora Exclusive'];

    if (product.brand) features.push('Brand Quality');
    if (product.files && product.files.length > 0) features.push('Personalization Available');

    return features;
  }

  private extractFeatures(product: any): string[] {
    const features = ['Premium Quality', 'Custom Design Options', 'Fast Shipping'];

    if (product.description) {
      if (product.description.includes('cotton')) features.push('Premium Cotton');
      if (product.description.includes('organic')) features.push('Organic Materials');
      if (product.description.includes('sustainable')) features.push('Eco-Friendly');
    }

    return features;
  }

  private generateSpecs(product: any): Record<string, string> {
    return {
      'Material': 'Premium Quality',
      'Customization': 'Available',
      'Production': '2-4 business days',
      'Shipping': 'Worldwide',
      'Quality': 'Guaranteed'
    };
  }

  private generateRating(): number {
    return 4.6 + Math.random() * 0.4; // 4.6 to 5.0
  }

  private generateReviewCount(price: number): number {
    const baseCount = Math.floor(Math.random() * 100) + 50;
    const priceMultiplier = price > 75 ? 0.7 : 1; // Luxury items have fewer but higher quality reviews
    return Math.floor(baseCount * priceMultiplier);
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private generateKeywords(product: any): string[] {
    const keywords = ['luxury', 'custom', 'premium', 'vienora'];

    if (product.title) {
      const titleWords = product.title.toLowerCase().split(' ');
      keywords.push(...titleWords.filter((word: string) => word.length > 3));
    }

    return [...new Set(keywords)].slice(0, 10);
  }

  // Demo products for when Printful API is not configured
  private getDemoLuxuryProducts(limit: number): VienoraProduct[] {
    const demoProducts: VienoraProduct[] = [
      {
        id: 'demo_1',
        name: 'Vienora Premium Custom T-Shirt',
        description: 'Luxury custom t-shirt made with premium materials and attention to detail.',
        price: 45,
        originalPrice: 54,
        discountPercentage: 17,
        images: ['/api/placeholder/300/300'],
        category: 'Luxury Apparel',
        rating: 4.8,
        reviewCount: 124,
        features: ['Premium Cotton', 'Custom Design', 'Fast Shipping'],
        specifications: {
          'Material': 'Premium Cotton',
          'Customization': 'Available',
          'Production': '2-4 business days'
        },
        supplier: {
          name: 'Printful Premium',
          location: 'United States',
          rating: 4.9,
          processingTime: '2-4 business days',
          shippingMethods: ['Express', 'Standard'],
          performanceScore: 95
        },
        inventory: {
          inStock: true,
          quantity: 999,
          lowStockThreshold: 10
        },
        shipping: {
          freeShipping: false,
          estimatedDays: '3-7 business days',
          methods: [
            { name: 'Standard Shipping', price: 9.99, duration: '5-7 days' },
            { name: 'Express Shipping', price: 19.99, duration: '3-4 days' }
          ]
        },
        luxury: {
          isLuxury: true,
          qualityScore: 85,
          qualityTier: 'Luxury',
          luxuryFeatures: ['Custom Design', 'Premium Materials', 'Vienora Exclusive'],
          isLimitedEdition: false,
          isHandcrafted: true,
          provenance: 'Printful Certified'
        },
        seo: {
          slug: 'vienora-premium-custom-t-shirt',
          metaTitle: 'Vienora Premium Custom T-Shirt - Luxury Collection',
          metaDescription: 'Premium custom t-shirt with luxury materials and custom design options.',
          keywords: ['luxury', 'custom', 'premium', 'vienora', 'tshirt']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Add more demo products as needed...
    ];

    return demoProducts.slice(0, limit);
  }
}

export const printfulSync = new PrintfulSync();
