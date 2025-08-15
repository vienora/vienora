'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import CustomerReviews from './CustomerReviews';
import { TrendingUp, Star, Award, Sparkles, ShoppingCart, Eye } from 'lucide-react';
import { getFeaturedProducts, RealProduct } from '@/lib/real-products';
import Link from 'next/link';

export default function TrendingSection() {
  const [featuredProducts, setFeaturedProducts] = useState<RealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);

  // Demo products defined early for dependency stability
  const demoFeaturedProducts: RealProduct[] = [
    {
      id: 'trending-1',
      name: 'Professional 4K Digital Camera System',
      description: 'Ultra-premium camera system with cutting-edge technology for professional photographers and content creators.',
      price: 2899,
      originalPrice: 3299,
      discountPercentage: 12,
      images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop'],
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 342,
      features: ['4K 120fps Video', '45MP Full-Frame Sensor', 'Professional Grade', 'Weather Sealed'],
      specifications: { brand: 'Elite', model: 'Pro X1', warranty: '3 years' },
      supplier: {
        name: 'Elite Tech Solutions',
        location: 'United States',
        rating: 4.9,
        processingTime: '1-2 business days',
        shippingMethods: ['Express', 'White-Glove']
      },
      inventory: { inStock: true, quantity: 15, lowStockThreshold: 5 },
      shipping: { freeShipping: true, estimatedDays: '2-3 business days', methods: [{ name: 'Express', price: 0, duration: '2-3 business days' }] },
      luxury: {
        isLuxury: true,
        qualityScore: 95,
        qualityTier: 'Ultra-Luxury' as const,
        luxuryFeatures: ['VIP Exclusive', 'Provenance Verified', 'Limited Production'],
        isLimitedEdition: false,
        isHandcrafted: false
      },
      seo: {
        slug: 'professional-4k-camera-system',
        metaTitle: 'Professional 4K Camera System - Elite Photography',
        metaDescription: 'Professional-grade 4K camera system for serious photographers',
        keywords: ['4K camera', 'professional photography', 'digital camera']
      },
      createdAt: '2025-01-12',
      updatedAt: '2025-01-13'
    }
  ];

  const loadFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await getFeaturedProducts(6);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback to demo data if API fails
      setFeaturedProducts(demoFeaturedProducts);
    } finally {
      setLoading(false);
    }
  }, [demoFeaturedProducts]);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };



  const displayProducts = featuredProducts.length > 0 ? featuredProducts : demoFeaturedProducts;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-amber-600/20 text-amber-300 border-amber-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Members Only
            </Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">Exclusive Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rare acquisitions and limited-edition pieces available only to our most distinguished clients.
            Each item represents the pinnacle of luxury and exclusivity.
          </p>
        </div>

        {/* Featured Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, index) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0] || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=400&fit=crop`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.luxury.isLimitedEdition && (
                      <Badge className="bg-amber-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Limited Edition
                      </Badge>
                    )}
                    {product.discountPercentage > 0 && (
                      <Badge className="bg-red-600 text-white">
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                    {product.shipping.freeShipping && (
                      <Badge className="bg-green-600 text-white">
                        Free Shipping
                      </Badge>
                    )}
                  </div>

                  {/* Luxury Score Badge */}
                  {product.luxury.qualityScore > 85 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Category & Supplier */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {product.supplier.location}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <Rating value={product.rating} readonly size="sm" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 text-amber-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Luxury Features */}
                  {product.luxury.luxuryFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.luxury.luxuryFeatures.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/product/${product.id}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowReviews(!showReviews)}
            className="mr-4"
          >
            <Star className="w-4 h-4 mr-2" />
            {showReviews ? 'Hide' : 'View'} Client Testimonials
          </Button>
          <Link href="/shop">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              View Private Collection
              <TrendingUp className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Customer Reviews Section */}
        {showReviews && (
          <div className="mt-16">
            <CustomerReviews />
          </div>
        )}
      </div>
    </section>
  );
}
