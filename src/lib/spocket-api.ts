interface SpocketProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number;
  images: string[];
  variants: SpocketVariant[];
  inventory_count: number;
  shipping_time: string;
  supplier: {
    name: string;
    location: string;
    rating: number;
  };
  category: string;
  tags: string[];
}

interface SpocketVariant {
  id: string;
  name: string;
  price: number;
  inventory_count: number;
  sku: string;
}

interface SpocketOrder {
  line_items: {
    spocket_product_id: string;
    variant_id: string;
    quantity: number;
  }[];
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  total_price: number;
}

class SpocketAPI {
  private baseURL = process.env.SPOCKET_BASE_URL || 'https://api.spocket.co/v1';
  private apiKey = process.env.SPOCKET_API_KEY;
  private isDemo: boolean;

  constructor() {
    this.isDemo = process.env.NEXT_PUBLIC_API_MODE === 'demo' || (this.apiKey ? this.apiKey.includes('demo') : false);

    if (this.isDemo) {
      console.log('🚀 Spocket API running in DEMO mode - using realistic test data');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (this.isDemo) {
      // Return demo response instead of making real API call
      return this.getDemoResponse(endpoint);
    }

    if (!this.apiKey) {
      throw new Error('Spocket API key not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Spocket API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  private getDemoResponse(endpoint: string) {
    if (endpoint.includes('/products')) {
      return {
        products: this.getDemoProducts(),
        total: 8
      };
    }

    return {
      products: [],
      total: 0
    };
  }

  private getDemoProducts() {
    return [
      {
        id: 'sp_201',
        name: 'Premium Wireless Headphones - Studio Quality',
        description: 'Professional-grade wireless headphones with noise cancellation and premium sound quality.',
        price: 149.99,
        compare_at_price: 199.99,
        images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'],
        variants: [
          { id: 'sp_201_v1', name: 'Black', price: 149.99, inventory_count: 15, sku: 'WH-SP201-BLK' }
        ],
        inventory_count: 15,
        shipping_time: '3-7 business days',
        supplier: {
          name: 'AudioTech Pro',
          location: 'United States',
          rating: 4.8
        },
        category: 'Electronics',
        tags: ['trending', 'premium', 'wireless']
      },
      {
        id: 'sp_202',
        name: 'Luxury Leather Wallet - Handcrafted',
        description: 'Genuine leather wallet handcrafted by skilled artisans with RFID protection.',
        price: 79.99,
        compare_at_price: 119.99,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
        variants: [
          { id: 'sp_202_v1', name: 'Brown', price: 79.99, inventory_count: 22, sku: 'LW-SP202-BRN' }
        ],
        inventory_count: 22,
        shipping_time: '2-5 business days',
        supplier: {
          name: 'Leather Masters',
          location: 'Italy',
          rating: 4.9
        },
        category: 'Accessories',
        tags: ['luxury', 'leather', 'handcrafted']
      },
      {
        id: 'sp_203',
        name: 'Smart Fitness Watch - Health Tracking',
        description: 'Advanced fitness watch with heart rate monitoring, GPS, and 7-day battery life.',
        price: 249.99,
        compare_at_price: 329.99,
        images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop'],
        variants: [
          { id: 'sp_203_v1', name: 'Black', price: 249.99, inventory_count: 8, sku: 'SW-SP203-BLK' }
        ],
        inventory_count: 8,
        shipping_time: '2-4 business days',
        supplier: {
          name: 'TechFit Inc',
          location: 'United States',
          rating: 4.7
        },
        category: 'Fitness Equipment',
        tags: ['smart', 'fitness', 'health']
      },
      {
        id: 'sp_204',
        name: 'Premium Kitchen Knife Set - Professional',
        description: 'Japanese steel knife set with ergonomic handles, perfect for professional cooking.',
        price: 189.99,
        compare_at_price: 299.99,
        images: ['https://images.unsplash.com/photo-1594736797933-d0d4a7049fb5?w=400&h=400&fit=crop'],
        variants: [
          { id: 'sp_204_v1', name: '5-piece set', price: 189.99, inventory_count: 12, sku: 'KS-SP204-5PC' }
        ],
        inventory_count: 12,
        shipping_time: '3-6 business days',
        supplier: {
          name: 'Chef Essentials',
          location: 'Germany',
          rating: 4.9
        },
        category: 'Kitchen Appliances',
        tags: ['professional', 'kitchen', 'Japanese']
      }
    ];
  }

  // Fetch all products with luxury filtering
  async fetchProducts(params: {
    category?: string;
    min_price?: number;
    max_price?: number;
    country?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<{ products: SpocketProduct[]; total: number }> {
    const queryParams = new URLSearchParams();

    // Set default params
    queryParams.set('per_page', (params.per_page || 50).toString());
    if (!this.isDemo) {
      queryParams.set('country', 'US,CA,GB,DE,FR');
      queryParams.set('min_price', '25');
    }

    // Add custom params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    const data = await this.makeRequest(`/products?${queryParams}`);

    // Filter for luxury/premium products
    const luxuryProducts = data.products.filter((product: any) =>
      product.price >= 25 &&
      product.images.length > 0 &&
      product.inventory_count > 0 &&
      !product.name.toLowerCase().includes('cheap') &&
      !product.name.toLowerCase().includes('wholesale')
    );

    console.log(`🚀 Spocket API: Retrieved ${luxuryProducts.length} products (${this.isDemo ? 'DEMO' : 'LIVE'} mode)`);

    return {
      products: luxuryProducts.map((product: any) => this.transformProduct(product)),
      total: data.total
    };
  }

  // Get single product details
  async getProduct(productId: string): Promise<SpocketProduct> {
    const data = await this.makeRequest(`/products/${productId}`);
    return this.transformProduct(data);
  }

  // Create order in Spocket
  async createOrder(orderData: SpocketOrder): Promise<any> {
    if (this.isDemo) {
      console.log('🚀 Spocket DEMO: Simulated order creation');
      return {
        id: `sp_order_${Date.now()}`,
        status: 'confirmed',
        tracking_number: `SP${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };
    }

    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<any> {
    if (this.isDemo) {
      return {
        id: orderId,
        status: 'shipped',
        tracking_number: `SP${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };
    }

    return this.makeRequest(`/orders/${orderId}`);
  }

  // Transform Spocket product to our format
  private transformProduct(spocketProduct: any): SpocketProduct {
    return {
      id: spocketProduct.id,
      name: spocketProduct.name,
      description: spocketProduct.description || 'Premium quality product sourced from verified suppliers.',
      price: Math.round(spocketProduct.price * 2.5), // 150% markup for luxury positioning
      compare_at_price: Math.round(spocketProduct.price * 3), // Show savings
      images: spocketProduct.images.map((img: any) => img.src || img),
      variants: spocketProduct.variants || [],
      inventory_count: spocketProduct.inventory_count || 0,
      shipping_time: spocketProduct.shipping_time || '5-12 business days',
      supplier: {
        name: spocketProduct.supplier?.name || 'Premium Supplier',
        location: spocketProduct.supplier?.country || 'United States',
        rating: 4.7 + Math.random() * 0.3, // Generate realistic ratings
      },
      category: this.mapCategory(spocketProduct.tags || []),
      tags: spocketProduct.tags || [],
    };
  }

  // Map Spocket categories to our luxury categories
  private mapCategory(tags: string[]): string {
    const tagString = tags.join(' ').toLowerCase();

    if (tagString.includes('jewelry') || tagString.includes('watch') || tagString.includes('ring')) {
      return 'Watches & Jewelry';
    }
    if (tagString.includes('home') || tagString.includes('furniture') || tagString.includes('decor')) {
      return 'Furniture';
    }
    if (tagString.includes('tech') || tagString.includes('electronic') || tagString.includes('gadget')) {
      return 'Electronics';
    }
    if (tagString.includes('fitness') || tagString.includes('sport') || tagString.includes('health')) {
      return 'Fitness Equipment';
    }
    if (tagString.includes('kitchen') || tagString.includes('cooking') || tagString.includes('appliance')) {
      return 'Kitchen Appliances';
    }
    if (tagString.includes('outdoor') || tagString.includes('camping') || tagString.includes('adventure')) {
      return 'Outdoor Gear';
    }

    return 'Luxury Hobbies'; // Default fallback
  }

  // Sync inventory (call this periodically)
  async syncInventory(): Promise<{ updated: number; errors: string[] }> {
    try {
      const { products } = await this.fetchProducts({ per_page: 100 });
      let updated = 0;
      const errors: string[] = [];

      for (const product of products) {
        try {
          // Update your database with real inventory
          await this.updateProductInDatabase(product);
          updated++;
        } catch (error) {
          errors.push(`Failed to update ${product.id}: ${error}`);
        }
      }

      return { updated, errors };
    } catch (error) {
      return { updated: 0, errors: [`Sync failed: ${error}`] };
    }
  }

  private async updateProductInDatabase(product: SpocketProduct) {
    // This would update your actual database
    // For now, we'll implement this when we connect to a real DB
    console.log(`Would update product: ${product.name}`);
  }
}

export const spocketAPI = new SpocketAPI();
export type { SpocketProduct, SpocketOrder };
