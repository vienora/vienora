'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Star,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  features: string[];
  availability: string[];
  sortBy: string;
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const categories = [
  'Electronics',
  'Furniture',
  'Outdoor Gear',
  'Kitchen Appliances',
  'Fitness Equipment',
  'Watches & Jewelry',
  'Luxury Hobbies',
  'Vehicles'
];

const features = [
  'Free Shipping',
  'White-Glove Service',
  'Provenance Verified',
  'Limited Edition',
  'Handcrafted',
  'Bespoke Options',
  'VIP Exclusive',
  'Rare Find'
];

const availabilityOptions = [
  'In Stock',
  'Pre-Order',
  'Made to Order',
  'Auction Only'
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'exclusive', label: 'Most Exclusive' }
];

export default function AdvancedSearch({ onFiltersChange, className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: [0, 10000],
    rating: 0,
    features: [],
    availability: [],
    sortBy: 'relevance'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    onFiltersChange(filters);

    // Count active filters
    let count = 0;
    if (filters.query) count++;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.rating > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.sortBy !== 'relevance') count++;

    setActiveFiltersCount(count);
  }, [filters, onFiltersChange]);

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters('categories', newCategories);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilters('features', newFeatures);
  };

  const toggleAvailability = (option: string) => {
    const newAvailability = filters.availability.includes(option)
      ? filters.availability.filter(a => a !== option)
      : [...filters.availability, option];
    updateFilters('availability', newAvailability);
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categories: [],
      priceRange: [0, 10000],
      rating: 0,
      features: [],
      availability: [],
      sortBy: 'relevance'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search exclusive luxury collections..."
                value={filters.query}
                onChange={(e) => updateFilters('query', e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              variant={showAdvanced ? "default" : "outline"}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-amber-600 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters('features', filters.features.includes('VIP Exclusive') ? filters.features.filter(f => f !== 'VIP Exclusive') : [...filters.features, 'VIP Exclusive'])}
              className={filters.features.includes('VIP Exclusive') ? 'bg-amber-100 border-amber-300' : ''}
            >
              <Award className="w-3 h-3 mr-1" />
              VIP Exclusive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters('features', filters.features.includes('Limited Edition') ? filters.features.filter(f => f !== 'Limited Edition') : [...filters.features, 'Limited Edition'])}
              className={filters.features.includes('Limited Edition') ? 'bg-amber-100 border-amber-300' : ''}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Limited Edition
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters('rating', filters.rating === 5 ? 0 : 5)}
              className={filters.rating === 5 ? 'bg-amber-100 border-amber-300' : ''}
            >
              <Star className="w-3 h-3 mr-1" />
              5 Star Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters('features', filters.features.includes('Free Shipping') ? filters.features.filter(f => f !== 'Free Shipping') : [...filters.features, 'Free Shipping'])}
              className={filters.features.includes('Free Shipping') ? 'bg-green-100 border-green-300' : ''}
            >
              Free Shipping
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Luxury Features</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <label
                        htmlFor={feature}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-semibold mb-3">Availability</h4>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={filters.availability.includes(option)}
                        onCheckedChange={() => toggleAvailability(option)}
                      />
                      <label
                        htmlFor={option}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters('priceRange', value as [number, number])}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold mb-3">Minimum Rating</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating >= rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilters('rating', rating === filters.rating ? 0 : rating)}
                      className="w-10 h-10 p-0"
                    >
                      <Star className={`w-4 h-4 ${filters.rating >= rating ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Sort Options */}
            <div>
              <h4 className="font-semibold mb-3">Sort Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters('sortBy', option.value)}
                    className="justify-start"
                  >
                    {option.value === 'exclusive' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {option.value === 'rating' && <Star className="w-3 h-3 mr-1" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
              </span>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
