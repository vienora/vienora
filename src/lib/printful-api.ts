import { VienoraProduct } from './types';

// Printful API configuration
const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulProduct {
  id: number;
  title: string;
  description: string;
  image: string;
  variants: PrintfulVariant[];
  category_id?: number;
}

interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  price: string;
  retail_price: string;
  size?: string;
  color?: string;
  availability_status: string;
  in_stock: boolean;
}

interface PrintfulResponse {
  code: number;
  result: any;
  extra?: any;
}

class PrintfulAPI {
  private apiKey: string;
  private baseHeaders: HeadersInit;
  private isDemo: boolean;

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || '';
    this.isDemo = process.env.NEXT_PUBLIC_API_MODE === 'demo' || this.apiKey.includes('demo');
    this.baseHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
    };

    if (this.isDemo) {
      console.log('🎨 Printful API running in DEMO mode - using realistic test data');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<PrintfulResponse> {
    if (this.isDemo) {
      // Return demo response instead of making real API call
      return this.getDemoResponse(endpoint);
    }

    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private getDemoResponse(endpoint: string): PrintfulResponse {
    if (endpoint.includes('/store/products')) {
      return {
        code: 200,
        result: this.getDemoProducts()
      };
    }

    return {
      code: 200,
      result: []
    };
  }

  private getDemoProducts() {
    return [
      {
        id: 101,
        name: 'Premium Canvas Art Print - Modern Abstract',
        thumbnail_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_101',
          category_id: 1,
          status: 'synced',
          external_id: 'canvas_art_001'
        },
        sync_variants: [{
          id: 'sv_101_1',
          name: '16x20 inch Canvas',
          retail_price: '89.99',
          variant: {
            id: 'v_101_1',
            availability_status: 'available'
          }
        }]
      },
      {
        id: 102,
        name: 'Professional Coffee Mug - Ceramic Premium',
        thumbnail_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_102',
          category_id: 7,
          status: 'synced',
          external_id: 'coffee_mug_001'
        },
        sync_variants: [{
          id: 'sv_102_1',
          name: '11oz White Ceramic',
          retail_price: '24.99',
          variant: {
            id: 'v_102_1',
            availability_status: 'available'
          }
        }]
      },
      {
        id: 103,
        name: 'Luxury Phone Case - Premium Protection',
        thumbnail_url: 'https://images.unsplash.com/photo-1512499617640-c4e8ec0bf1f4?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_103',
          category_id: 6,
          status: 'synced',
          external_id: 'phone_case_001'
        },
        sync_variants: [{
          id: 'sv_103_1',
          name: 'iPhone 15 Pro Case',
          retail_price: '34.99',
          variant: {
            id: 'v_103_1',
            availability_status: 'available'
          }
        }]
      },
      {
        id: 104,
        name: 'Designer T-Shirt - Premium Cotton',
        thumbnail_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_104',
          category_id: 1,
          status: 'synced',
          external_id: 'tshirt_001'
        },
        sync_variants: [{
          id: 'sv_104_1',
          name: 'Size L - Black',
          retail_price: '29.99',
          variant: {
            id: 'v_104_1',
            availability_status: 'available'
          }
        }]
      },
      {
        id: 105,
        name: 'Premium Notebook - Leather Bound',
        thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_105',
          category_id: 4,
          status: 'synced',
          external_id: 'notebook_001'
        },
        sync_variants: [{
          id: 'sv_105_1',
          name: 'A5 Hardcover',
          retail_price: '19.99',
          variant: {
            id: 'v_105_1',
            availability_status: 'available'
          }
        }]
      },
      {
        id: 106,
        name: 'Professional Poster Print - High Quality',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        sync_product: {
          id: 'sp_106',
          category_id: 1,
          status: 'synced',
          external_id: 'poster_001'
        },
        sync_variants: [{
          id: 'sv_106_1',
          name: '24x36 inch Poster',
          retail_price: '49.99',
          variant: {
            id: 'v_106_1',
            availability_status: 'available'
          }
        }]
      }
    ];
  }

  async fetchProducts(params: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: VienoraProduct[]; total: number }> {
    try {
      const { limit = 20, offset = 0 } = params;

      // Get store products (demo or real)
      const response = await this.makeRequest('/store/products');

      if (response.code !== 200) {
        throw new Error(`Printful API returned code: ${response.code}`);
      }

      const printfulProducts = response.result || [];

      // Transform Printful products to our format
      const products: VienoraProduct[] = printfulProducts.slice(offset, offset + limit).map((product: any) => {
        const baseVariant = product.sync_variants?.[0] || {};
        const variant = baseVariant.variant || {};

        return {
          id: `printful_${product.id}`,
          name: product.name || 'Untitled Product',
          description: baseVariant.name || product.name || '',
          price: parseFloat(baseVariant.retail_price || '29.99'),
          originalPrice: parseFloat(baseVariant.retail_price || '29.99') * 1.2,
          images: [product.thumbnail_url || '/placeholder-product.jpg'],
          rating: 4.2 + Math.random() * 0.8,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          category: this.mapPrintfulCategory(product.sync_product?.category_id),
          discountPercentage: Math.round(((parseFloat(baseVariant.retail_price || '29.99') * 1.2 - parseFloat(baseVariant.retail_price || '29.99')) / (parseFloat(baseVariant.retail_price || '29.99') * 1.2)) * 100),
          features: ['Premium Materials', 'Print on Demand', 'Quality Guaranteed'],
          specifications: {
            'Quality Grade': 'Premium',
            'Print Method': 'Digital',
            'Fulfillment': 'On-Demand'
          },
          inventory: {
            inStock: true,
            quantity: Math.floor(Math.random() * 50) + 10,
            lowStockThreshold: 5
          },
          shipping: {
            freeShipping: true,
            estimatedDays: '5-7 business days',
            methods: [
              { name: 'Standard Shipping', price: 0, duration: '5-7 days' },
              { name: 'Express Shipping', price: 15, duration: '2-3 days' }
            ]
          },
          luxury: {
            isLuxury: this.calculateQualityScore(product) > 80,
            qualityScore: this.calculateQualityScore(product),
            qualityTier: this.calculateQualityScore(product) >= 90 ? 'Ultra-Luxury' as const :
                        this.calculateQualityScore(product) >= 80 ? 'Luxury' as const : 'Premium' as const,
            luxuryFeatures: ['Premium Quality', 'Custom Design', 'Fast Fulfillment'],
            isLimitedEdition: false,
            isHandcrafted: false
          },
          seo: {
            slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            metaTitle: `${product.name || 'Product'} - Vienora`,
            metaDescription: `Premium ${product.name || 'product'} from our exclusive collection`,
            keywords: ['premium', 'luxury', 'quality']
          },
          supplier: {
            name: 'Printful',
            location: 'Latvia/US',
            rating: 4.5,
            processingTime: '2-5 business days',
            shippingMethods: ['Standard', 'Express', 'Priority'],
            performanceScore: 85
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      console.log(`🖨️ Printful API: Retrieved ${products.length} products (${this.isDemo ? 'DEMO' : 'LIVE'} mode)`);

      return {
        products,
        total: printfulProducts.length
      };

    } catch (error) {
      if (this.isDemo) {
        console.error('Printful DEMO API error:', error);
        throw error;
      }

      console.error('Printful API error:', error);
      throw error;
    }
  }

  async getProductDetails(productId: string): Promise<VienoraProduct | null> {
    try {
      const response = await this.makeRequest(`/store/products/${productId}`);

      if (response.code !== 200) {
        return null;
      }

      const product = response.result;
      const baseVariant = product.sync_variants?.[0] || {};

      return {
        id: `printful_${product.id}`,
        name: product.name || 'Untitled Product',
        description: baseVariant.name || product.name || '',
        price: parseFloat(baseVariant.retail_price || '29.99'),
        originalPrice: parseFloat(baseVariant.retail_price || '29.99') * 1.2,
        images: [product.thumbnail_url || '/placeholder-product.jpg'],
        rating: 4.2 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        category: this.mapPrintfulCategory(product.sync_product?.category_id),
        discountPercentage: Math.round(((parseFloat(baseVariant.retail_price || '29.99') * 1.2 - parseFloat(baseVariant.retail_price || '29.99')) / (parseFloat(baseVariant.retail_price || '29.99') * 1.2)) * 100),
        features: ['Premium Print Quality', 'On-Demand Fulfillment'],
        specifications: { 'Quality': 'Premium' },
        inventory: {
          inStock: true,
          quantity: Math.floor(Math.random() * 50) + 10,
          lowStockThreshold: 5
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '5-7 business days',
          methods: [{ name: 'Standard', price: 0, duration: '5-7 days' }]
        },
        luxury: {
          isLuxury: this.calculateQualityScore(product) > 80,
          qualityScore: this.calculateQualityScore(product),
          qualityTier: this.calculateQualityScore(product) >= 90 ? 'Ultra-Luxury' as const : 'Premium' as const,
          luxuryFeatures: ['Premium Quality'],
          isLimitedEdition: false,
          isHandcrafted: false
        },
        seo: {
          slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          metaTitle: product.name || 'Product',
          metaDescription: 'Premium product',
          keywords: ['premium']
        },
        supplier: {
          name: 'Printful',
          location: 'Latvia/US',
          rating: 4.5,
          processingTime: '2-5 business days',
          shippingMethods: ['Standard', 'Express', 'Priority'],
          performanceScore: 85
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching Printful product details:', error);
      return null;
    }
  }

  async checkInventoryStatus(productIds: string[]): Promise<{ [key: string]: boolean }> {
    try {
      const results: { [key: string]: boolean } = {};

      // Check each product's inventory status
      for (const productId of productIds) {
        try {
          const response = await this.makeRequest(`/store/products/${productId}`);
          results[productId] = response.code === 200 && response.result?.sync_product?.status === 'synced';
        } catch {
          results[productId] = this.isDemo; // In demo mode, assume available
        }
      }

      return results;
    } catch (error) {
      console.error('Error checking Printful inventory:', error);
      return {};
    }
  }

  private mapPrintfulCategory(categoryId?: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'clothing',
      2: 'accessories',
      3: 'home-decor',
      4: 'stationery',
      5: 'bags',
      6: 'phone-cases',
      7: 'drinkware',
      8: 'jewelry',
      // Add more mappings as needed
    };

    return categoryMap[categoryId || 0] || 'miscellaneous';
  }

  private calculateQualityScore(product: any): number {
    let score = 70; // Base score

    // Check if product has good metadata
    if (product.sync_product?.status === 'synced') score += 10;
    if (product.sync_variants?.length > 1) score += 5;
    if (product.name && product.name.length > 10) score += 5;
    if (product.thumbnail_url) score += 10;

    return Math.min(score, 100);
  }
}

export const printfulAPI = new PrintfulAPI();
