'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rating } from '@/components/ui/rating';
import {
  Heart,
  HeartOff,
  Share,
  Download,
  Eye,
  ShoppingCart,
  Star,
  Crown,
  Sparkles,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Bell,
  Plus,
  Trash2,
  Edit,
  Lock,
  Users,
  Globe
} from 'lucide-react';
import { RealProduct } from '@/lib/real-products';

interface WishlistItem {
  id: string;
  product: RealProduct;
  addedDate: Date;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  priceAlerts: boolean;
  availabilityAlerts: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdDate: Date;
  tags: string[];
  shareCount: number;
}

interface LuxuryWishlistProps {
  userId: string;
  userTier: 'elite' | 'prestige' | 'sovereign';
}

export default function LuxuryWishlist({ userId, userTier }: LuxuryWishlistProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>('main');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'priority' | 'name'>('date');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Demo data
  const demoProducts: RealProduct[] = [
    {
      id: 'wish-1',
      name: 'Vintage Rolex Submariner 1960s',
      description: 'Exceptional vintage timepiece from the golden era of diving watches',
      price: 45000,
      originalPrice: 52000,
      discountPercentage: 13,
      images: ['https://images.unsplash.com/photo-1548068437-d35155d9ecdd?w=400&h=400&fit=crop'],
      category: 'Watches & Jewelry',
      rating: 4.9,
      reviewCount: 67,
      features: ['Original Box', 'Papers Included', 'Service History'],
      specifications: {},
      supplier: { name: 'Heritage Timepieces', location: 'Switzerland', rating: 4.9, processingTime: '1-2 weeks', shippingMethods: [] },
      inventory: { inStock: true, quantity: 1, lowStockThreshold: 1 },
      shipping: { freeShipping: true, estimatedDays: '5-7 days', methods: [] },
      luxury: { isLuxury: true, qualityScore: 95, qualityTier: 'Ultra-Luxury' as const, luxuryFeatures: ['Heritage Collection', 'Certified Authentic', 'Museum Quality'], isLimitedEdition: true, isHandcrafted: true, provenance: 'Certified Original' },
      seo: { slug: 'vintage-rolex-submariner', metaTitle: '', metaDescription: '', keywords: [] },
      createdAt: '2024-12-01', updatedAt: '2024-12-01'
    },
    {
      id: 'wish-2',
      name: 'Abstract Contemporary Art by Kaws',
      description: 'Limited edition sculpture from renowned contemporary artist',
      price: 125000,
      originalPrice: 150000,
      discountPercentage: 17,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'],
      category: 'Fine Art & Collectibles',
      rating: 5.0,
      reviewCount: 23,
      features: ['Certificate of Authenticity', 'Limited Edition #47/100', 'Museum Provenance'],
      specifications: {},
      supplier: { name: 'Contemporary Gallery', location: 'New York', rating: 5.0, processingTime: '2-3 weeks', shippingMethods: [] },
      inventory: { inStock: true, quantity: 1, lowStockThreshold: 1 },
      shipping: { freeShipping: true, estimatedDays: '2-3 weeks', methods: [] },
      luxury: { isLuxury: true, qualityScore: 98, qualityTier: 'Ultra-Luxury' as const, luxuryFeatures: ['Museum Quality', 'Investment Grade', 'Exclusive Access'], isLimitedEdition: true, isHandcrafted: true, provenance: 'Museum Collection' },
      seo: { slug: 'kaws-contemporary-sculpture', metaTitle: '', metaDescription: '', keywords: [] },
      createdAt: '2024-11-28', updatedAt: '2024-11-28'
    }
  ];

  useEffect(() => {
    // Initialize with demo collections
    const demoCollections: Collection[] = [
      {
        id: 'main',
        name: 'My Luxury Wishlist',
        description: 'Curated collection of exceptional pieces',
        items: demoProducts.map((product, index) => ({
          id: `item-${index + 1}`,
          product,
          addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
          priority: index === 0 ? 'high' : 'medium',
          notes: index === 0 ? 'Perfect for my vintage collection' : 'Consider for the gallery wall',
          priceAlerts: true,
          availabilityAlerts: true
        })),
        isPublic: false,
        createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        tags: ['luxury', 'investment', 'collection'],
        shareCount: 0
      },
      {
        id: 'investment',
        name: 'Investment Portfolio',
        description: 'High-value pieces for long-term appreciation',
        items: [demoProducts[1]].map((product) => ({
          id: 'invest-1',
          product,
          addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          notes: 'Strong investment potential - Kaws pieces trending up',
          priceAlerts: true,
          availabilityAlerts: true
        })),
        isPublic: true,
        createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        tags: ['investment', 'art', 'appreciation'],
        shareCount: 12
      }
    ];
    setCollections(demoCollections);
  }, []);

  const currentCollection = collections.find(c => c.id === activeCollection) || collections[0];

  const filteredItems = currentCollection?.items.filter(item =>
    filterPriority === 'all' || item.priority === filterPriority
  ).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.addedDate.getTime() - a.addedDate.getTime();
      case 'price':
        return b.product.price - a.product.price;
      case 'name':
        return a.product.name.localeCompare(b.product.name);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  }) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      description: '',
      items: [],
      isPublic: false,
      createdDate: new Date(),
      tags: [],
      shareCount: 0
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setShowCreateCollection(false);
    setActiveCollection(newCollection.id);
  };

  const shareCollection = (collection: Collection) => {
    const shareData = {
      title: `${collection.name} - Luxury Collection`,
      text: `Check out my curated luxury collection: ${collection.description}`,
      url: `${window.location.origin}/wishlist/${collection.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      // Show toast notification
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            Luxury Collections
          </h1>
          <p className="text-muted-foreground">Curate and organize your most coveted luxury pieces</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowCreateCollection(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Collections Tabs */}
      <Tabs value={activeCollection} onValueChange={setActiveCollection}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-auto">
            {collections.map((collection) => (
              <TabsTrigger key={collection.id} value={collection.id} className="flex items-center gap-2">
                {collection.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {collection.name}
                <Badge variant="secondary" className="ml-1">
                  {collection.items.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Filters */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="priority">Sort by Priority</option>
              <option value="name">Sort by Name</option>
            </select>

            <div className="flex border rounded-lg">
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

        {collections.map((collection) => (
          <TabsContent key={collection.id} value={collection.id} className="space-y-6">
            {/* Collection Info */}
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{collection.name}</h3>
                      <div className="flex items-center gap-2">
                        {collection.isPublic ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                        {collection.shareCount > 0 && (
                          <Badge variant="secondary">
                            <Users className="w-3 h-3 mr-1" />
                            {collection.shareCount} shares
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{collection.description || 'No description provided'}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{collection.items.length} items</span>
                      <span>Created {collection.createdDate.toLocaleDateString()}</span>
                      <span>
                        Total Value: {formatPrice(collection.items.reduce((sum, item) => sum + item.product.price, 0))}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => shareCollection(collection)}>
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No items in this collection</h3>
                  <p className="text-muted-foreground">Start adding luxury pieces to build your curated collection</p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredItems.map((item) => (
                  <Card key={item.id} className={`group overflow-hidden hover:shadow-xl transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} overflow-hidden`}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Priority Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </div>

                      {/* Alerts */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1">
                        {item.priceAlerts && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Bell className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" className="bg-white/90">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="bg-white/90">
                            <HeartOff className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Added {item.addedDate.toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Rating value={item.product.rating} readonly size="sm" />
                        <span className="text-sm text-muted-foreground">
                          {item.product.rating.toFixed(1)}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          <strong>Notes:</strong> {item.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">{formatPrice(item.product.price)}</span>
                          {item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.product.luxury.luxuryFeatures.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Collection Modal */}
      {showCreateCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <div className="flex gap-3">
                <Button onClick={createCollection} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCreateCollection(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
