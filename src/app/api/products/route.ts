import { NextRequest, NextResponse } from 'next/server';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'auto';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('📦 Product API called with source:', source);

    // Demo luxury products for Vienora
    const demoProducts = [
      {
        id: 'vn-001',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with premium sound engineering and luxury finish.',
        price: 299,
        originalPrice: 399,
        discountPercentage: 25,
        images: ['https://source.unsplash.com/400x400/?luxury-headphones'],
        category: 'Electronics',
        rating: 4.8,
        reviewCount: 156,
        features: ['Noise Cancellation', 'Premium Materials', 'Long Battery Life'],
        specifications: { Brand: 'Vienora Audio', Model: 'VA-001' },
        supplier: {
          name: 'Premium Electronics',
          location: 'California, USA',
          rating: 4.9,
          processingTime: '1-2 business days',
          shippingMethods: ['Express', 'Standard'],
          performanceScore: 95
        },
        inventory: {
          inStock: true,
          quantity: 50,
          lowStockThreshold: 10
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '3-5 business days',
          methods: [
            { name: 'Express', price: 0, duration: '1-2 days' }
          ]
        },
        luxury: {
          isLuxury: true,
          qualityScore: 88,
          qualityTier: 'Luxury' as const,
          luxuryFeatures: ['Premium Materials', 'Expert Craftsmanship'],
          isLimitedEdition: false,
          isHandcrafted: false,
          provenance: 'California Design Studio'
        },
        seo: {
          slug: 'premium-wireless-headphones',
          metaTitle: 'Premium Wireless Headphones - Vienora',
          metaDescription: 'High-quality wireless headphones with premium sound.',
          keywords: ['headphones', 'wireless', 'premium', 'luxury']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vn-002',
        name: 'Luxury Coffee Machine',
        description: 'Professional-grade espresso machine with precision engineering and elegant design.',
        price: 1299,
        originalPrice: 1599,
        discountPercentage: 19,
        images: ['https://source.unsplash.com/400x400/?luxury-coffee-machine'],
        category: 'Kitchen Appliances',
        rating: 4.9,
        reviewCount: 89,
        features: ['Professional Grade', 'Precision Temperature', 'Premium Materials'],
        specifications: { Brand: 'Vienora Kitchen', Model: 'VK-002' },
        supplier: {
          name: 'Luxury Appliances Co.',
          location: 'Italy',
          rating: 4.8,
          processingTime: '2-3 business days',
          shippingMethods: ['Express', 'Standard'],
          performanceScore: 92
        },
        inventory: {
          inStock: true,
          quantity: 25,
          lowStockThreshold: 5
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '5-7 business days',
          methods: [
            { name: 'Express', price: 0, duration: '3-5 days' }
          ]
        },
        luxury: {
          isLuxury: true,
          qualityScore: 94,
          qualityTier: 'Ultra-Luxury' as const,
          luxuryFeatures: ['Italian Craftsmanship', 'Premium Steel', 'Professional Grade'],
          isLimitedEdition: true,
          isHandcrafted: true,
          provenance: 'Milan Design Studio'
        },
        seo: {
          slug: 'luxury-coffee-machine',
          metaTitle: 'Luxury Coffee Machine - Vienora',
          metaDescription: 'Professional-grade espresso machine with precision engineering.',
          keywords: ['coffee', 'espresso', 'luxury', 'kitchen']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'vn-003',
        name: 'Designer Watch Collection',
        description: 'Handcrafted timepiece with Swiss movement and premium materials.',
        price: 899,
        originalPrice: 1199,
        discountPercentage: 25,
        images: ['https://source.unsplash.com/400x400/?luxury-watch'],
        category: 'Watches & Jewelry',
        rating: 4.7,
        reviewCount: 234,
        features: ['Swiss Movement', 'Sapphire Crystal', 'Premium Leather'],
        specifications: { Brand: 'Vienora Time', Model: 'VT-003' },
        supplier: {
          name: 'Swiss Timepieces',
          location: 'Switzerland',
          rating: 4.9,
          processingTime: '3-5 business days',
          shippingMethods: ['Express', 'Standard'],
          performanceScore: 98
        },
        inventory: {
          inStock: true,
          quantity: 15,
          lowStockThreshold: 3
        },
        shipping: {
          freeShipping: true,
          estimatedDays: '7-10 business days',
          methods: [
            { name: 'Express', price: 0, duration: '5-7 days' }
          ]
        },
        luxury: {
          isLuxury: true,
          qualityScore: 96,
          qualityTier: 'Ultra-Luxury' as const,
          luxuryFeatures: ['Swiss Craftsmanship', 'Precious Materials', 'Limited Edition'],
          isLimitedEdition: true,
          isHandcrafted: true,
          provenance: 'Geneva Atelier'
        },
        seo: {
          slug: 'designer-watch-collection',
          metaTitle: 'Designer Watch Collection - Vienora',
          metaDescription: 'Handcrafted timepiece with Swiss movement.',
          keywords: ['watch', 'swiss', 'luxury', 'timepiece']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Filter by category if requested
    let filteredProducts = demoProducts;
    if (category) {
      filteredProducts = demoProducts.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Limit results
    const products = filteredProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      source: 'demo',
      products,
      total: products.length,
      message: 'Demo luxury products loaded successfully',
      filters: {
        category,
        limit
      }
    });

  } catch (error) {
    console.error('❌ Product API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
