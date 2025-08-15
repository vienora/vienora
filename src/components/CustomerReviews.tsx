'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Rating } from '@/components/ui/rating';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  ThumbsUp,
  Verified,
  Award,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerTitle?: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  productPurchased: string;
  isVipMember?: boolean;
}

interface CustomerReviewsProps {
  productId?: string;
  showProductFilter?: boolean;
}

const luxuryReviews: Review[] = [
  {
    id: '1',
    customerName: 'Victoria Ashworth',
    customerTitle: 'Art Collector',
    location: 'Manhattan, NY',
    rating: 5,
    title: 'Unparalleled Quality and Service',
    content: 'This Italian leather sofa exceeded every expectation. The craftsmanship is extraordinary, and the white-glove delivery service was impeccable. Vienora truly understands luxury.',
    date: '2024-12-15',
    verified: true,
    helpful: 24,
    productPurchased: 'Luxury Italian Leather Sofa',
    isVipMember: true
  },
  {
    id: '2',
    customerName: 'James Morrison',
    customerTitle: 'Tech Executive',
    location: 'Beverly Hills, CA',
    rating: 5,
    title: 'Museum-Quality Pieces',
    content: 'The Professional 4K Camera arrived perfectly packaged with authenticity certificates. The attention to detail in both product and service is what sets Vienora apart from ordinary retailers.',
    date: '2024-12-10',
    verified: true,
    helpful: 18,
    productPurchased: 'Professional 4K Digital Camera',
    isVipMember: true
  },
  {
    id: '3',
    customerName: 'Sophia Chen',
    customerTitle: 'Interior Designer',
    location: 'London, UK',
    rating: 5,
    title: 'Exclusive Access to Rare Finds',
    content: 'Being part of Vienora\'s elite membership has given me access to pieces I couldn\'t find anywhere else. The curation is exceptional, and the provenance verification gives complete confidence.',
    date: '2024-12-08',
    verified: true,
    helpful: 31,
    productPurchased: 'Bespoke Furniture Collection',
    isVipMember: true
  },
  {
    id: '4',
    customerName: 'Alexander Dubois',
    customerTitle: 'Private Collector',
    location: 'Monaco',
    rating: 5,
    title: 'White-Glove Service Excellence',
    content: 'The espresso machine was delivered by appointment with full setup and training. This level of personalized service is what luxury should be. Absolutely flawless experience.',
    date: '2024-12-05',
    verified: true,
    helpful: 15,
    productPurchased: 'Professional Espresso Machine',
    isVipMember: true
  }
];

export default function CustomerReviews({ productId, showProductFilter = false }: CustomerReviewsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 2;
  const totalPages = Math.ceil(luxuryReviews.length / reviewsPerPage);

  const currentReviews = luxuryReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const averageRating = luxuryReviews.reduce((sum, review) => sum + review.rating, 0) / luxuryReviews.length;
  const totalReviews = luxuryReviews.length;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Quote className="w-8 h-8 text-amber-600" />
          <h2 className="text-3xl font-bold">Elite Client Testimonials</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover why discerning clients choose Vienora for their most important acquisitions
        </p>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-amber-600">{averageRating.toFixed(1)}</span>
              <Rating value={averageRating} readonly size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">{totalReviews} Elite Reviews</p>
          </div>

          <Separator orientation="vertical" className="h-12" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Verified className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold">100%</span>
            </div>
            <p className="text-sm text-muted-foreground">Verified Purchases</p>
          </div>

          <Separator orientation="vertical" className="h-12" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold">VIP</span>
            </div>
            <p className="text-sm text-muted-foreground">Member Exclusive</p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="relative">
        <div className="grid md:grid-cols-2 gap-6">
          {currentReviews.map((review) => (
            <Card key={review.id} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700">
                      <span className="text-white font-semibold text-lg">
                        {review.customerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.customerName}</h4>
                        {review.verified && (
                          <Verified className="w-4 h-4 text-green-600" />
                        )}
                        {review.isVipMember && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            VIP Member
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.customerTitle} • {review.location}
                      </p>
                    </div>
                  </div>
                  <Rating value={review.rating} readonly size="sm" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
                  <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Purchased:</span> {review.productPurchased}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.helpful}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Luxury accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-600/20 to-transparent" />
            </Card>
          ))}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-slate-50 to-amber-50 border-amber-200">
        <CardContent className="text-center py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Verified className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Verified Purchases</h4>
              <p className="text-sm text-muted-foreground">
                All reviews from authenticated luxury acquisitions
              </p>
            </div>
            <div>
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">VIP Member Reviews</h4>
              <p className="text-sm text-muted-foreground">
                Exclusive insights from our most discerning clients
              </p>
            </div>
            <div>
              <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Curated Excellence</h4>
              <p className="text-sm text-muted-foreground">
                Only the finest pieces worthy of elite testimonials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
