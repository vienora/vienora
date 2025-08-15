'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/5 bg-[length:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <Badge className="bg-amber-600/20 text-amber-300 border-amber-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Premium Collection 2025
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Curated Premium
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  {' '}Products
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover carefully selected premium products from trusted suppliers worldwide. Quality items, competitive prices, and reliable shipping for modern shoppers.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Trending Products</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Browse Collection
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-amber-400">500+</div>
                <div className="text-sm text-gray-400">Elite Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">50+</div>
                <div className="text-sm text-gray-400">Exclusive Pieces</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">100%</div>
                <div className="text-sm text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt="Premium Products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-sm font-medium">Private Collection</div>
                <div className="text-lg font-bold">Ultra-Luxury Essentials</div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 z-20 bg-white/10 backdrop-blur rounded-lg p-4 text-white">
              <div className="text-xs text-gray-300">This Quarter</div>
              <div className="text-lg font-bold">$2.5M+ Acquired</div>
            </div>

            <div className="absolute -bottom-4 -left-4 z-20 bg-white/10 backdrop-blur rounded-lg p-4 text-white">
              <div className="text-xs text-gray-300">Available Now</div>
              <div className="text-lg font-bold">💎 Rare Finds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
