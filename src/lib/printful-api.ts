interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  thumbnail: string;
  is_ignored: boolean;
  synced: number;
  retail_price: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  variants: PrintfulVariant[];
}

interface PrintfulVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  sku: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
    size: string;
    color: string;
    color_code: string;
    color_code2?: string;
  };
  files: Array<{
    id: number;
    type: string;
    hash: string;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
  }>;
}

interface PrintfulCatalogProduct {
  id: number;
  type: string;
  description: string;
  type_name: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  retail_price: string;
  files: Array<{
    id: string;
    type: string;
    title: string;
    additional_price: string;
  }>;
  options: Array<{
    id: string;
    title: string;
    type: string;
    values: Record<string, any>;
    additional_price: string;
  }>;
  dimensions: {
    front: string;
  };
  is_discontinued: boolean;
}

class PrintfulAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || '';
    this.baseUrl = process.env.PRINTFUL_BASE_URL || 'https://api.printful.com';

    if (!this.apiKey) {
      console.warn('⚠️ PRINTFUL_API_KEY not found in environment variables');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Printful API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.result;
  }

  // Get all store products (your custom products)
  async getStoreProducts(): Promise<PrintfulProduct[]> {
    return this.makeRequest('/store/products');
  }

  // Get catalog products (available for customization)
  async getCatalogProducts(): Promise<PrintfulCatalogProduct[]> {
    return this.makeRequest('/products');
  }

  // Get specific product details
  async getProduct(productId: number): Promise<PrintfulCatalogProduct> {
    return this.makeRequest(`/products/${productId}`);
  }

  // Get product variants
  async getProductVariants(productId: number) {
    return this.makeRequest(`/products/${productId}`);
  }

  // Create a new store product
  async createStoreProduct(productData: any) {
    return this.makeRequest('/store/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Get shipping rates
  async getShippingRates(recipient: any, items: any[]) {
    return this.makeRequest('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify({ recipient, items }),
    });
  }

  // Create order
  async createOrder(orderData: any) {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/store');
      return true;
    } catch (error) {
      console.error('Printful API connection test failed:', error);
      return false;
    }
  }
}

export const printfulAPI = new PrintfulAPI();
export type { PrintfulProduct, PrintfulVariant, PrintfulCatalogProduct };
