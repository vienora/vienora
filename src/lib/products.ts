export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  trending?: boolean;
  freeShipping?: boolean;
}

export const categories = [
  'Electronics',
  'Furniture',
  'Outdoor Gear',
  'Kitchen Appliances',
  'Fitness Equipment',
  'Watches & Jewelry',
  'Vehicles',
  'Luxury Hobbies'
];

export const products: Product[] = [
  // Electronics
  {
    id: '1',
    name: 'Professional 4K Digital Camera',
    price: 2899,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
    category: 'Electronics',
    description: 'Professional-grade 4K digital camera with advanced autofocus and image stabilization for stunning photography.',
    features: ['4K Video Recording', '45MP Sensor', 'Weather Sealed', 'Dual Card Slots'],
    inStock: true,
    rating: 4.8,
    reviews: 342,
    trending: true,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Premium Wireless Noise-Cancelling Headphones',
    price: 449,
    originalPrice: 549,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    category: 'Electronics',
    description: 'Industry-leading noise cancellation with premium audio quality and 30-hour battery life.',
    features: ['Active Noise Cancellation', '30hr Battery', 'Premium Audio', 'Touch Controls'],
    inStock: true,
    rating: 4.9,
    reviews: 1284,
    trending: true,
    freeShipping: true
  },
  {
    id: '3',
    name: 'Smart Home Theater System',
    price: 1899,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    category: 'Electronics',
    description: 'Complete 7.1 surround sound system with wireless connectivity and smart home integration.',
    features: ['7.1 Surround Sound', 'Wireless Connectivity', 'Smart Integration', 'Premium Speakers'],
    inStock: true,
    rating: 4.7,
    reviews: 567,
    freeShipping: true
  },

  // Furniture
  {
    id: '4',
    name: 'Luxury Italian Leather Sofa',
    price: 3299,
    originalPrice: 4199,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    category: 'Furniture',
    description: 'Handcrafted Italian leather sofa with premium hardwood frame and exceptional comfort.',
    features: ['Italian Leather', 'Hardwood Frame', 'Handcrafted', 'Lifetime Warranty'],
    inStock: true,
    rating: 4.9,
    reviews: 189,
    trending: true,
    freeShipping: true
  },
  {
    id: '5',
    name: 'Designer LED Ceiling Light',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    category: 'Furniture',
    description: 'Modern designer LED ceiling light with adjustable brightness and smart home compatibility.',
    features: ['Smart Controls', 'Adjustable Brightness', 'Energy Efficient', 'Modern Design'],
    inStock: true,
    rating: 4.6,
    reviews: 234,
    freeShipping: true
  },
  {
    id: '6',
    name: 'Premium Memory Foam Mattress',
    price: 1599,
    originalPrice: 2099,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop',
    category: 'Furniture',
    description: 'Luxury memory foam mattress with cooling technology and 100-night trial.',
    features: ['Memory Foam', 'Cooling Technology', '100-Night Trial', 'Free Setup'],
    inStock: true,
    rating: 4.8,
    reviews: 892,
    trending: true,
    freeShipping: true
  },

  // Outdoor Gear
  {
    id: '7',
    name: 'Professional Camping Tent 4-Person',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    category: 'Outdoor Gear',
    description: 'Weather-resistant 4-person camping tent with advanced ventilation and easy setup.',
    features: ['4-Person Capacity', 'Weather Resistant', 'Easy Setup', 'Ventilation System'],
    inStock: true,
    rating: 4.7,
    reviews: 445,
    trending: true,
    freeShipping: true
  },
  {
    id: '8',
    name: 'GPS Navigation System for Hiking',
    price: 549,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
    category: 'Outdoor Gear',
    description: 'Advanced GPS system with topographic maps, weather updates, and long battery life.',
    features: ['Topographic Maps', 'Weather Updates', '20hr Battery', 'Waterproof'],
    inStock: true,
    rating: 4.8,
    reviews: 321,
    freeShipping: true
  },

  // Kitchen Appliances
  {
    id: '9',
    name: 'Professional Espresso Machine',
    price: 2199,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    category: 'Kitchen Appliances',
    description: 'Commercial-grade espresso machine with dual boiler system and precision temperature control.',
    features: ['Dual Boiler', 'Precision Control', 'Commercial Grade', 'Steam Wand'],
    inStock: true,
    rating: 4.9,
    reviews: 267,
    trending: true,
    freeShipping: true
  },
  {
    id: '10',
    name: 'Premium Gas Grill Station',
    price: 1899,
    originalPrice: 2399,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    category: 'Kitchen Appliances',
    description: 'Professional gas grill with multiple burners, side station, and premium stainless steel construction.',
    features: ['Multiple Burners', 'Stainless Steel', 'Side Station', 'Easy Ignition'],
    inStock: true,
    rating: 4.7,
    reviews: 398,
    freeShipping: true
  },

  // Fitness Equipment
  {
    id: '11',
    name: 'Commercial Grade Treadmill',
    price: 3499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1571019613914-85e046d6b5d0?w=800&h=600&fit=crop',
    category: 'Fitness Equipment',
    description: 'Commercial-grade treadmill with advanced shock absorption and interactive training programs.',
    features: ['Shock Absorption', 'Interactive Programs', 'Commercial Grade', 'Heart Rate Monitor'],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    trending: true,
    freeShipping: true
  },
  {
    id: '12',
    name: 'Professional Weightlifting Set',
    price: 1299,
    originalPrice: 1699,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    category: 'Fitness Equipment',
    description: 'Complete weightlifting set with Olympic barbell, plates, and adjustable rack system.',
    features: ['Olympic Barbell', 'Adjustable Rack', 'Complete Set', 'Safety Features'],
    inStock: true,
    rating: 4.7,
    reviews: 287,
    freeShipping: true
  },

  // Watches & Jewelry
  {
    id: '13',
    name: 'Luxury Swiss Automatic Watch',
    price: 2899,
    originalPrice: 3599,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    category: 'Watches & Jewelry',
    description: 'Swiss-made automatic watch with sapphire crystal and premium leather strap.',
    features: ['Swiss Movement', 'Sapphire Crystal', 'Leather Strap', 'Water Resistant'],
    inStock: true,
    rating: 4.9,
    reviews: 123,
    trending: true,
    freeShipping: true
  },
  {
    id: '14',
    name: 'Diamond Tennis Necklace',
    price: 4599,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
    category: 'Watches & Jewelry',
    description: 'Elegant diamond tennis necklace with certified diamonds and 18k white gold setting.',
    features: ['Certified Diamonds', '18k White Gold', 'Certificate Included', 'Gift Box'],
    inStock: true,
    rating: 4.8,
    reviews: 89,
    freeShipping: true
  },

  // Vehicles
  {
    id: '15',
    name: 'Premium Electric Scooter',
    price: 1599,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Vehicles',
    description: 'High-performance electric scooter with long-range battery and premium suspension.',
    features: ['Long Range Battery', 'Premium Suspension', 'App Connectivity', 'LED Lights'],
    inStock: true,
    rating: 4.6,
    reviews: 445,
    trending: true,
    freeShipping: true
  },
  {
    id: '16',
    name: 'Carbon Fiber Mountain Bike',
    price: 2799,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1544191696-15693a5d85d4?w=800&h=600&fit=crop',
    category: 'Vehicles',
    description: 'Professional carbon fiber mountain bike with advanced suspension and precision components.',
    features: ['Carbon Fiber Frame', 'Advanced Suspension', 'Precision Components', 'Professional Grade'],
    inStock: true,
    rating: 4.8,
    reviews: 234,
    freeShipping: true
  },

  // Luxury Hobbies
  {
    id: '17',
    name: 'Professional Telescope',
    price: 1899,
    originalPrice: 2399,
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    category: 'Luxury Hobbies',
    description: 'Advanced telescope with computerized mount and premium optics for astronomical observation.',
    features: ['Computerized Mount', 'Premium Optics', 'Astronomical Software', 'Tripod Included'],
    inStock: true,
    rating: 4.7,
    reviews: 178,
    trending: true,
    freeShipping: true
  },
  {
    id: '18',
    name: 'Professional Golf Club Set',
    price: 2599,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop',
    category: 'Luxury Hobbies',
    description: 'Complete professional golf club set with titanium drivers and precision irons.',
    features: ['Titanium Drivers', 'Precision Irons', 'Complete Set', 'Premium Bag'],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    freeShipping: true
  }
];

export const getTrendingProducts = () => products.filter(p => p.trending);
export const getFeaturedProducts = () => products.slice(0, 6);
export const getProductsByCategory = (category: string) =>
  products.filter(p => p.category === category);
