'use client';

import { useParams } from 'next/navigation';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

// Mock reviews data
const generateReviews = (productId: string) => [
  {
    id: '1',
    user: 'John D.',
    rating: 5,
    date: '2025-01-05',
    title: 'Excellent quality!',
    content: 'This product exceeded my expectations. The build quality is outstanding and it arrived quickly.',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    user: 'Sarah M.',
    rating: 4,
    date: '2025-01-03',
    title: 'Very satisfied',
    content: 'Great product overall. Exactly as described and fast shipping. Would recommend!',
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    user: 'Mike R.',
    rating: 5,
    date: '2024-12-28',
    title: 'Perfect purchase',
    content: 'Amazing quality and customer service. This has become my go-to brand for premium products.',
    verified: false,
    helpful: 5
  }
];

export default function ProductPageClient() {
  const params = useParams();
  const productId = params.id as string;
  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const { addItem, openCart } = useCart();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const reviews = generateReviews(productId);
  const images = [product.image, product.image, product.image]; // Mock multiple images

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <span>Home</span> / <span>{product.category}</span> / <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? 'border-purple-600' : 'border-transparent'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {product.trending && (
              <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
                ✨ Featured
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-600 text-white">
                -{discountPercentage}% OFF
              </Badge>
            )}
            {product.freeShipping && (
              <Badge className="bg-green-600 text-white">
                Free Shipping
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-green-600 font-medium">
                You save {formatPrice(product.originalPrice! - product.price)}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>White-Glove Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Provenance Verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">{review.content}</p>
                    <div className="text-xs text-muted-foreground">
                      {review.helpful} people found this helpful
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Specifications</h3>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-muted-foreground">Feature {index + 1}</span>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-muted-foreground">In Stock</span>
                    <span className="font-medium">{product.inStock ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Information</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Free shipping on orders over $500</li>
                      <li>• Standard shipping: 3-5 business days</li>
                      <li>• Express shipping: 1-2 business days</li>
                      <li>• International shipping available</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 30-day return window</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free returns on defective items</li>
                      <li>• Refund processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
