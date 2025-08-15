'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Sofa, Mountain, ChefHat, Dumbbell, Watch, Car, Star } from 'lucide-react';
import { categories } from '@/lib/products';
import Link from 'next/link';

const categoryIcons = {
  'Electronics': Smartphone,
  'Furniture': Sofa,
  'Outdoor Gear': Mountain,
  'Kitchen Appliances': ChefHat,
  'Fitness Equipment': Dumbbell,
  'Watches & Jewelry': Watch,
  'Vehicles': Car,
  'Luxury Hobbies': Star
};

const categoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop',
  'Furniture': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'Outdoor Gear': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
  'Kitchen Appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  'Fitness Equipment': 'https://images.unsplash.com/photo-1571019613914-85e046d6b5d0?w=400&h=300&fit=crop',
  'Watches & Jewelry': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'Vehicles': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'Luxury Hobbies': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop'
};

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Explore by
            <span className="bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
              {' '}Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our meticulously curated categories, each featuring the world's most coveted luxury items. Reserved for those who demand nothing but the finest.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            const imageUrl = categoryImages[category as keyof typeof categoryImages];

            return (
              <Link
                key={category}
                href={`/category/${category.toLowerCase().replace(' ', '-')}`}
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={category}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Icon */}
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-lg font-bold mb-1">{category}</h3>
                        <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Premium {category.toLowerCase()} collection
                        </p>
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">Shop Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Featured Categories Banner */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Electronics Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-700 to-yellow-700 p-8 text-white">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Elite Technology</h3>
              <p className="text-amber-100">
                Ultra-premium devices and cutting-edge innovations reserved for the most discerning collectors.
              </p>
              <Button className="bg-white text-amber-700 hover:bg-gray-100">
                Explore Technology
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12" />
          </div>

          {/* Furniture Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-800 to-yellow-800 p-8 text-white">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sofa className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Bespoke Furniture</h3>
              <p className="text-amber-100">
                One-of-a-kind pieces and limited editions from the world's most prestigious designers and ateliers.
              </p>
              <Button className="bg-white text-amber-800 hover:bg-gray-100">
                View Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
