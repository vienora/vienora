import axios from 'axios';

// ⚠️ PRODUCTION WARNING:
// This is a demonstration of Spocket API integration. For production use:
// 1. Sign up for Spocket API access at https://www.spocket.co/integrations/api
// 2. Implement proper error handling and retry logic
// 3. Set up webhook endpoints for inventory and order updates
// 4. Handle rate limiting (100 requests per minute limit)
// 5. Ensure compliance with Spocket terms of service

interface SpocketProduct {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  description: string;
  category: string;
  supplier: {
    name: string;
    location: string;
    processingTime: string;
  };
  shipping: {
    cost: number;
    time: string;
    freeShippingCountries: string[];
  };
  variants: Array<{
    id: string;
    title: string;
    price: number;
    inventory: number;
    weight: number;
  }>;
  tags: string[];
}

interface SpocketOrder {
  id: string;
  externalId: string; // Your order ID
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  total: number;
  createdAt: string;
  updatedAt: string;
}

class SpocketAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SPOCKET_API_KEY || 'demo_api_key';
    this.baseUrl = 'https://api.spocket.co/api/v1';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Search products
  async searchProducts(
    query?: string,
    category?: string,
    country?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ products: SpocketProduct[]; pagination: any }> {
    try {
      if (process.env.NODE_ENV === 'production') {
        const params = new URLSearchParams({
          ...(query && { search: query }),
          ...(category && { category }),
          ...(country && { country }),
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await axios.get(`${this.baseUrl}/catalog/products?${params}`, {
          headers: this.getHeaders(),
        });

        return {
          products: response.data.products.map(this.mapSpocketProduct),
          pagination: response.data.pagination,
        };
      } else {
        // Demo mode
        return this.getMockProducts(query, page, limit);
      }
    } catch (error) {
      console.error('Spocket search error:', error);
      throw new Error('Failed to search Spocket products');
    }
  }

  // Get product details
  async getProduct(productId: string): Promise<SpocketProduct | null> {
    try {
      if (process.env.NODE_ENV === 'production') {
        const response = await axios.get(`${this.baseUrl}/catalog/products/${productId}`, {
          headers: this.getHeaders(),
        });

        return this.mapSpocketProduct(response.data.product);
      } else {
        // Demo mode
        return this.getMockProduct(productId);
      }
    } catch (error) {
      console.error('Spocket product details error:', error);
      return null;
    }
  }

  // Push order to Spocket
  async createOrder(orderData: {
    externalId: string;
    items: Array<{
      productId: string;
      variantId: string;
      quantity: number;
    }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      province: string;
      zip: string;
      country: string;
      phone?: string;
    };
    note?: string;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      if (process.env.NODE_ENV === 'production') {
        const response = await axios.post(`${this.baseUrl}/orders`, orderData, {
          headers: this.getHeaders(),
        });

        return {
          success: true,
          orderId: response.data.order.id,
        };
      } else {
        // Demo mode - simulate successful order
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          orderId: `SP${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        };
      }
    } catch (error) {
      console.error('Spocket order creation error:', error);
      return {
        success: false,
        error: 'Failed to create order with Spocket',
      };
    }
  }

  // Get order status
  async getOrder(orderId: string): Promise<SpocketOrder | null> {
    try {
      if (process.env.NODE_ENV === 'production') {
        const response = await axios.get(`${this.baseUrl}/orders/${orderId}`, {
          headers: this.getHeaders(),
        });

        return response.data.order;
      } else {
        // Demo mode
        return this.getMockOrder(orderId);
      }
    } catch (error) {
      console.error('Spocket order status error:', error);
      return null;
    }
  }

  // Get orders list
  async getOrders(
    status?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ orders: SpocketOrder[]; pagination: any }> {
    try {
      if (process.env.NODE_ENV === 'production') {
        const params = new URLSearchParams({
          ...(status && { status }),
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await axios.get(`${this.baseUrl}/orders?${params}`, {
          headers: this.getHeaders(),
        });

        return {
          orders: response.data.orders,
          pagination: response.data.pagination,
        };
      } else {
        // Demo mode
        return this.getMockOrders(status, page, limit);
      }
    } catch (error) {
      console.error('Spocket orders list error:', error);
      throw new Error('Failed to fetch orders from Spocket');
    }
  }

  // Update inventory for products
  async updateInventory(): Promise<{ success: boolean; updated: number }> {
    try {
      if (process.env.NODE_ENV === 'production') {
        // This would typically be done via webhooks in production
        const response = await axios.post(`${this.baseUrl}/catalog/products/sync`, {}, {
          headers: this.getHeaders(),
        });

        return {
          success: true,
          updated: response.data.updated_count,
        };
      } else {
        // Demo mode
        return { success: true, updated: 25 };
      }
    } catch (error) {
      console.error('Spocket inventory sync error:', error);
      return { success: false, updated: 0 };
    }
  }

  // Helper methods for mapping and mock data
  private mapSpocketProduct(product: any): SpocketProduct {
    return {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      compareAtPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : undefined,
      images: product.images || [],
      description: product.description || '',
      category: product.category || 'General',
      supplier: {
        name: product.supplier?.name || 'Unknown Supplier',
        location: product.supplier?.location || 'Unknown',
        processingTime: product.supplier?.processing_time || '1-3 days',
      },
      shipping: {
        cost: parseFloat(product.shipping_cost || '0'),
        time: product.shipping_time || '7-14 days',
        freeShippingCountries: product.free_shipping_countries || [],
      },
      variants: product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: parseFloat(variant.price),
        inventory: variant.inventory || 0,
        weight: parseFloat(variant.weight || '0'),
      })) || [],
      tags: product.tags || [],
    };
  }

  private getMockProducts(query?: string, page: number = 1, limit: number = 20) {
    const mockProducts: SpocketProduct[] = [
      {
        id: 'sp_001',
        title: `Premium ${query || 'Product'} - US/EU Supplier`,
        price: 45.99,
        compareAtPrice: 59.99,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
        ],
        description: 'High-quality product from verified US/EU suppliers with fast shipping',
        category: 'Electronics',
        supplier: {
          name: 'PremiumTech USA',
          location: 'United States',
          processingTime: '1-2 days',
        },
        shipping: {
          cost: 0,
          time: '3-7 days',
          freeShippingCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
        },
        variants: [
          { id: 'sp_001_v1', title: 'Black', price: 45.99, inventory: 25, weight: 0.5 },
          { id: 'sp_001_v2', title: 'White', price: 47.99, inventory: 18, weight: 0.5 },
        ],
        tags: ['trending', 'fast-shipping', 'verified-supplier'],
      },
      // Add more mock products...
    ];

    return {
      products: mockProducts.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: 150,
        totalPages: Math.ceil(150 / limit),
      },
    };
  }

  private getMockProduct(productId: string): SpocketProduct {
    return {
      id: productId,
      title: 'Premium Spocket Product',
      price: 49.99,
      compareAtPrice: 69.99,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'],
      description: 'Premium product with fast shipping from US/EU suppliers',
      category: 'Electronics',
      supplier: {
        name: 'FastShip Inc',
        location: 'United States',
        processingTime: '1-3 days',
      },
      shipping: {
        cost: 0,
        time: '3-7 days',
        freeShippingCountries: ['US', 'CA', 'GB'],
      },
      variants: [
        { id: `${productId}_v1`, title: 'Standard', price: 49.99, inventory: 50, weight: 0.3 },
      ],
      tags: ['verified', 'fast-shipping'],
    };
  }

  private getMockOrder(orderId: string): SpocketOrder {
    return {
      id: orderId,
      externalId: `TL${Math.random().toString(36).substr(2, 6)}`,
      status: 'processing',
      trackingNumber: `1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      items: [
        {
          productId: 'sp_001',
          variantId: 'sp_001_v1',
          quantity: 1,
          price: 45.99,
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        province: 'NY',
        zip: '10001',
        country: 'US',
        phone: '+1-555-0123',
      },
      total: 45.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private getMockOrders(status?: string, page: number = 1, limit: number = 20) {
    const orders = [this.getMockOrder('sp_order_1'), this.getMockOrder('sp_order_2')];

    return {
      orders: orders.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: 5,
        totalPages: 1,
      },
    };
  }
}

export const spocketAPI = new SpocketAPI();
export type { SpocketProduct, SpocketOrder };
