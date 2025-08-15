'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import AdvancedSearch from '@/components/AdvancedSearch';
import CustomerReviews from '@/components/CustomerReviews';
import { getCuratedProducts, getProductsByCategory, RealProduct } from '@/lib/real-products';
import { categories } from '@/lib/products';
import { TrendingUp, Star, Award, Sparkles, ShoppingCart, Eye, Filter, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';

interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  features: string[];
  availability: string[];
  sortBy: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<RealProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RealProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: [0, 10000],
    rating: 0,
    features: [],
    availability: [],
    sortBy: 'relevance'
  });

  // Demo fallback data
  const demoProducts: RealProduct[] = [
    {
      id: 'demo-1',
      name: 'Professional 4K Digital Camera',
      description: 'Ultra-premium camera system for discerning photographers',
      price: 2899,
      originalPrice: 3299,
      discountPercentage: 12,
      images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400'],
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 342,
      features: ['4K Video Recording', '45MP Sensor', 'Professional Grade'],
      specifications: {},
      supplier: {
        name: 'Elite Tech',
        location: 'United States',
        rating: 4.9,
        processingTime: '1-2 days',
        shippingMethods: ['White-Glove']
      },
      inventory: { inStock: true, quantity: 15, lowStockThreshold: 5 },
      shipping: { freeShipping: true, estimatedDays: '2-3 days', methods: [] },
      luxury: {
        isLuxury: true,
        qualityScore: 92,
        qualityTier: 'Ultra-Luxury' as const,
        luxuryFeatures: ['VIP Exclusive', 'Provenance Verified'],
        isLimitedEdition: false,
        isHandcrafted: false
      },
      seo: { slug: 'professional-4k-camera', metaTitle: '', metaDescription: '', keywords: [] },
      createdAt: '2025-01-13',
      updatedAt: '2025-01-13'
    }
  ];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading real products from Spocket...');

      // Fetch real products from Spocket API
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success && data.products.length > 0) {
        console.log(`Loaded ${data.products.length} real products from ${data.source}`);
        setProducts(data.products);

        if (data.source === 'demo') {
          console.warn('Using demo products - Check Spocket API configuration');
        }
      } else {
        throw new Error('No products returned from API');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to demo data
      console.log('Falling back to demo products');
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  }, [demoProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Text search
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (currentFilters.categories.length > 0) {
      filtered = filtered.filter(product =>
        currentFilters.categories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= currentFilters.priceRange[0] &&
      product.price <= currentFilters.priceRange[1]
    );

    // Rating filter
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(product =>
        product.rating >= currentFilters.rating
      );
    }

    // Features filter
    if (currentFilters.features.length > 0) {
      filtered = filtered.filter(product =>
        currentFilters.features.some(feature =>
          product.luxury.luxuryFeatures.includes(feature) ||
          product.features.includes(feature)
        )
      );
    }

    // Availability filter
    if (currentFilters.availability.length > 0) {
      filtered = filtered.filter(product => {
        if (currentFilters.availability.includes('In Stock')) {
          return product.inventory.inStock;
        }
        return true;
      });
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'exclusive':
        filtered.sort((a, b) => b.luxury.qualityScore - a.luxury.qualityScore);
        break;
      default:
        // Relevance - already sorted by luxury score from API
        break;
    }

    setFilteredProducts(filtered);
  }, [products, currentFilters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Luxury Collection
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our curated selection of the world's finest luxury goods,
              available exclusively to our distinguished members.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Search */}
      <div className="container mx-auto px-4 py-8">
        <AdvancedSearch onFiltersChange={setCurrentFilters} />
      </div>

      {/* Results Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredProducts.length} Luxury Items
            </h2>
            <p className="text-muted-foreground">
              Curated from our exclusive collection
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="container mx-auto px-4 mb-16">
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products match your criteria</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => setCurrentFilters({
              query: '',
              categories: [],
              priceRange: [0, 10000],
              rating: 0,
              features: [],
              availability: [],
              sortBy: 'relevance'
            })}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid'
              ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'grid-cols-1 gap-4'
          }`}>
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className={`group overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
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
                        Limited
                      </Badge>
                    )}
                    {product.discountPercentage > 0 && (
                      <Badge className="bg-red-600 text-white">
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </div>

                  {/* Luxury Score */}
                  {product.luxury.qualityScore > 85 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Elite
                      </Badge>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/90">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
                    {product.features.slice(0, viewMode === 'list' ? 3 : 2).map((feature, idx) => (
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
      </div>

      {/* Customer Reviews */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <CustomerReviews />
        </div>
      </div>
    </div>
  );
}
