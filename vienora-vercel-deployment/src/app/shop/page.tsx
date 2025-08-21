'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VienoraProduct } from '@/lib/types';

export default function ShopPage() {
  const [products, setProducts] = useState<VienoraProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productSource, setProductSource] = useState<string>('demo');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'luxury-apparel', name: 'Luxury Apparel' },
    { id: 'luxury-accessories', name: 'Premium Accessories' },
    { id: 'luxury-home', name: 'Exclusive Home' },
    { id: 'tech-accessories', name: 'Tech Luxury' },
    { id: 'office-stationery', name: 'Office & Stationery' }
  ];

  const qualityTiers = [
    { id: 'all', name: 'All Tiers' },
    { id: 'Premium', name: 'Premium ($25-50)' },
    { id: 'Luxury', name: 'Luxury ($50-100)' },
    { id: 'Ultra-Luxury', name: 'Ultra-Luxury ($100+)' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products?source=auto&limit=50');
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setProductSource(data.source);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter(product => {
      if (selectedCategory !== 'all' && !product.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('-', ' '))) {
        return false;
      }
      if (selectedTier !== 'all' && product.luxury.qualityTier !== selectedTier) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-zinc-800">Vienora</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-zinc-600 hover:text-zinc-800 transition-colors">Home</Link>
            <Link href="/shop" className="text-amber-600 font-semibold">Shop</Link>
            <Link href="/collections" className="text-zinc-600 hover:text-zinc-800 transition-colors">Collections</Link>
            <Link href="/about" className="text-zinc-600 hover:text-zinc-800 transition-colors">About</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-zinc-600 hover:text-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-zinc-600 hover:text-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="text-zinc-600 hover:text-zinc-800 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-zinc-800 mb-4">
              Luxury <span className="text-amber-600">Collections</span>
            </h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Discover our curated selection of premium products, each piece carefully chosen for its exceptional quality and luxury appeal.
            </p>

            {productSource === 'demo' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-800 font-medium">Demo Mode Active</p>
                    <p className="text-amber-700 text-sm">Configure Printful API to display real luxury products. <Link href="/api/printful/test" className="underline">Check status</Link>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality Tier Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Quality Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {qualityTiers.map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-zinc-600">
                  <span className="font-semibold">{filteredAndSortedProducts.length}</span> products found
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 animate-pulse">
                  <div className="bg-zinc-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-zinc-200 h-4 rounded mb-2"></div>
                  <div className="bg-zinc-200 h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-zinc-200 h-6 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-zinc-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 1l8 6v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7l8-6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">No products found</h3>
              <p className="text-zinc-600 mb-4">Try adjusting your filters to see more products.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTier('all');
                  setSortBy('featured');
                }}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 group-hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="bg-zinc-100 h-48 rounded-lg mb-4 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-200 transition-colors">
                      Product Image
                    </div>

                    {/* Product Info */}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                        {product.luxury.qualityTier}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">{product.category}</span>
                    </div>

                    <h3 className="font-semibold text-zinc-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>

                    {/* Features */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.luxury.luxuryFeatures.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-zinc-800">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <>
                          <span className="text-sm text-zinc-500 line-through">
                            ${product.originalPrice}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            {product.discountPercentage}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M10 1l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L1 8l6-1z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">({product.reviewCount})</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500">{product.supplier.name}</span>
                    </div>

                    {/* Shipping */}
                    <div className="text-xs text-zinc-600 mb-4">
                      {product.shipping.freeShipping ? (
                        <span className="text-green-600 font-medium">✓ Free Shipping</span>
                      ) : (
                        <span>Shipping from ${product.shipping.methods[0]?.price || 9.99}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
