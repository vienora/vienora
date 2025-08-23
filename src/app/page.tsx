'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VienoraProduct } from '@/lib/types';
import { Bell, Star, Truck, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<VienoraProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productSource, setProductSource] = useState<string>('demo');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?source=auto&limit=8');
        const data = await response.json();

        if (data.success) {
          setFeaturedProducts(data.products);
          setProductSource(data.source);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className={`${scrolled ? 'bg-gray-50/80 backdrop-blur-md border-b border-white/20' : 'bg-gray-50 border-b border-gray-200'} sticky top-0 z-50 py-2 transition-all duration-300 ease-in-out`}>
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span>Free Shipping on Orders Over $500</span>
            <span>•</span>
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/track" className="hover:text-gray-800 transition-colors">Track Order</Link>
            <Link href="/support" className="hover:text-gray-800 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' : 'bg-white border-b border-gray-200'} sticky top-[34px] z-40 transition-all duration-300 ease-in-out`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 relative">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                {/* Bold shield background with button colors */}
                <circle cx="16" cy="16" r="15" stroke="#D97706" strokeWidth="2" fill="none" opacity="0.6"/>
                <path d="M16 4 C9 4 5 7 5 12 L5 22 C5 27 9 30 16 30 C23 30 27 27 27 22 L27 12 C27 7 23 4 16 4 Z" fill="#1E1B4B" stroke="#D97706" strokeWidth="2"/>

                {/* Bold V letterform with button gradient */}
                <path d="M10 12 L15.5 24 L16.5 24 L22 12 L20 12 L16 22 L12 12 Z" fill="#D97706"/>

                {/* Bold crown element */}
                <path d="M11 10 L13.5 7 L16 8.5 L18.5 7 L21 10 L18.5 11.5 L16 10 L13.5 11.5 Z" fill="#CA8A04"/>

                {/* Power accent */}
                <circle cx="16" cy="26" r="1.2" fill="#FCD34D"/>
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>Vienora</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Home</Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Exclusive</Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Categories</Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Collections</Link>
            <Link href="/loyalty" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Rewards</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search premium products"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-56"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <Link href="/category/electronics" className="hover:text-gray-800 transition-colors">Electronics</Link>
            <Link href="/category/furniture" className="hover:text-gray-800 transition-colors">Furniture</Link>
            <Link href="/category/outdoor-gear" className="hover:text-gray-800 transition-colors">Outdoor Gear</Link>
            <Link href="/category/kitchen-appliances" className="hover:text-gray-800 transition-colors">Kitchen Appliances</Link>
            <Link href="/category/fitness-equipment" className="hover:text-gray-800 transition-colors">Fitness Equipment</Link>
            <Link href="/category/watches-jewelry" className="hover:text-gray-800 transition-colors">Watches & Jewelry</Link>
            <Link href="/categories" className="hover:text-gray-800 transition-colors">View All</Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Matching TrendLux Design */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-600 min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-orange-300 text-sm font-medium mb-6" style={{backgroundColor: 'rgba(202, 147, 51, 0.2)', color: '#ca9333'}}>
                ✨ Premium Collection 2025
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Curated<br />
                <span style={{color: '#ca9333'}}>Premium</span><br />
                Products
              </h1>

              <p className="text-lg lg:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
                Discover carefully selected premium products from trusted suppliers worldwide. Quality items, competitive prices, and reliable shipping for modern shoppers.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <div className="flex items-center space-x-3 text-gray-200">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-200">
                  <div className="w-8 h-8 rounded-full" style={{backgroundColor: '#ca9333'}}>
                    <TrendingUp className="w-4 h-4 text-white ml-2 mt-2" />
                  </div>
                  <span>Trending Products</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg text-white" style={{backgroundColor: '#ca9333'}}>
                  Shop Now →
                </button>
                <button className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Members Only
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold" style={{color: '#ca9333'}}>500+</div>
                  <div className="text-gray-300 text-sm">Elite Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{color: '#ca9333'}}>50+</div>
                  <div className="text-gray-300 text-sm">Exclusive Pieces</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{color: '#ca9333'}}>100%</div>
                  <div className="text-gray-300 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Right Content - Luxury Wardrobe */}
            <div className="relative">
              <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="text-right mb-4">
                  <div className="text-sm text-gray-300">This Quarter</div>
                  <div className="text-4xl font-bold text-white">$2.5M+ Acquired</div>
                </div>

                <div className="relative">
                  <img
                    src="https://ext.same-assets.com/617734984/1088617361.jpeg"
                    alt="Luxury Wardrobe Collection"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="text-orange-300 font-semibold text-sm">Private Collection</div>
                    <div className="text-white font-bold text-lg">Available Now</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">VIP</div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-orange-300 font-semibold text-sm">Ultra-Luxury Essentials</div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="text-white font-bold text-lg">🏆 Rare Finds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Collection Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: '#ca9333', color: 'white'}}>
            Members Only
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Exclusive Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Rare acquisitions and limited-edition pieces available only to our most distinguished clients.
            Each item represents the pinnacle of luxury and exclusivity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              // Loading placeholders
              <>
                {[1,2,3,4,5,6].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md p-6">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                ))}
              </>
            ) : featuredProducts.length > 0 ? (
              // Real products from API
              <>
                {featuredProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6 group hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.luxury?.isLuxury && (
                      <div className="absolute top-2 right-2">
                        <div className="text-xs px-3 py-1 rounded-full font-semibold text-white" style={{backgroundColor: '#ca9333'}}>
                          {product.luxury?.qualityTier || 'Premium'}
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold" style={{color: '#ca9333'}}>
                        ${product.price || '0'}
                      </span>
                      {product.originalPrice && product.originalPrice > (product.price || 0) && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {product.rating ? product.rating.toFixed(1) : '4.5'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    From {product.supplier?.name || 'Premium Supplier'} • {product.supplier?.location || 'Global'}
                  </div>
                </div>
                ))}
              </>
            ) : (
              // Fallback if no products
              <div className="col-span-full text-center text-gray-500 py-8">
                <p>Loading exclusive products...</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button className="text-gray-600 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              ⭐ View Client Testimonials
            </button>
            <button className="text-white px-6 py-3 rounded-lg transition-colors" style={{backgroundColor: '#ca9333'}}>
              View Private Collection →
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore by <span style={{color: '#ca9333'}}>Category</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access our meticulously curated categories, each featuring the world's most coveted luxury items.
              Reserved for those who demand nothing but the finest.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/category/electronics" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/1114268768.svg" alt="Electronics" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Electronics</h3>
              </div>
            </Link>
            <Link href="/category/furniture" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/2547858992.svg" alt="Furniture" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Furniture</h3>
              </div>
            </Link>
            <Link href="/category/outdoor-gear" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/2670880804.svg" alt="Outdoor Gear" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Outdoor Gear</h3>
              </div>
            </Link>
            <Link href="/category/kitchen-appliances" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/759834110.svg" alt="Kitchen Appliances" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Kitchen Appliances</h3>
              </div>
            </Link>
            <Link href="/category/fitness-equipment" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/967900743.svg" alt="Fitness Equipment" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Fitness Equipment</h3>
              </div>
            </Link>
            <Link href="/category/watches-jewelry" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/2232992653.svg" alt="Watches & Jewelry" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Watches & Jewelry</h3>
              </div>
            </Link>
            <Link href="/category/vehicles" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/2110032337.svg" alt="Vehicles" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Vehicles</h3>
              </div>
            </Link>
            <Link href="/category/luxury-hobbies" className="group">
              <div className="bg-gray-100 rounded-xl p-6 text-center hover:bg-orange-50 transition-colors">
                <img src="https://ext.same-assets.com/617734984/537876025.svg" alt="Luxury Hobbies" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">Luxury Hobbies</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 relative">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                    {/* Bold shield background with button colors */}
                    <circle cx="16" cy="16" r="15" stroke="#D97706" strokeWidth="2" fill="none" opacity="0.6"/>
                    <path d="M16 4 C9 4 5 7 5 12 L5 22 C5 27 9 30 16 30 C23 30 27 27 27 22 L27 12 C27 7 23 4 16 4 Z" fill="#1E1B4B" stroke="#D97706" strokeWidth="2"/>

                    {/* Bold V letterform with button gradient */}
                    <path d="M10 12 L15.5 24 L16.5 24 L22 12 L20 12 L16 22 L12 12 Z" fill="#D97706"/>

                    {/* Bold crown element */}
                    <path d="M11 10 L13.5 7 L16 8.5 L18.5 7 L21 10 L18.5 11.5 L16 10 L13.5 11.5 Z" fill="#CA8A04"/>

                    {/* Power accent */}
                    <circle cx="16" cy="26" r="1.2" fill="#FCD34D"/>
                  </svg>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-md" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>Vienora</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world's most exclusive luxury marketplace. We provide privileged access to rare finds
                and ultra-premium collections for the most discerning clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/exclusive">Exclusive Collection</Link></li>
                <li><Link href="/categories">All Categories</Link></li>
                <li><Link href="/about">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/track">Track Your Order</Link></li>
                <li><Link href="/returns">Returns & Exchanges</Link></li>
                <li><Link href="/shipping">Shipping Info</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+1 (555) 123-4567</li>
                <li>concierge@vienora.com</li>
                <li>Fifth Avenue, NYC 10022</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Vienora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
