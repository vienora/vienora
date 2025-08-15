'use client';

import Link from 'next/link';
import { Search, Menu, Heart, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { categories } from '@/lib/products';
import ShoppingCartComponent from './ShoppingCart';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import VienoraLogo from './VienoraLogo';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { state } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-12 items-center justify-between border-b text-sm">
          <div className="hidden md:flex items-center gap-4">
            <span className="text-muted-foreground">Free Shipping on Orders Over $500</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">24/7 Customer Support</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/track" className="text-muted-foreground hover:text-foreground">
              Track Order
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-foreground">
              Support
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex h-16 items-center gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="flex items-center">
                  <VienoraLogo size="md" variant="full" />
                </Link>
                <nav className="flex flex-col gap-2">
                  <Link href="/" className="py-2 text-sm hover:text-primary">
                    Home
                  </Link>
                  <Link href="/shop" className="py-2 text-sm hover:text-primary">
                    Exclusive Collection
                  </Link>
                  <Link href="/wishlist" className="py-2 text-sm hover:text-primary">
                    My Collections
                  </Link>
                  <Link href="/loyalty" className="py-2 text-sm hover:text-primary">
                    VIP Rewards
                  </Link>
                  <Link href="/notifications" className="py-2 text-sm hover:text-primary">
                    VIP Notifications
                  </Link>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Categories</div>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase().replace(' ', '-')}`}
                        className="py-1 text-xs hover:text-primary block"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <VienoraLogo size="md" variant="full" className="hover:opacity-80 transition-opacity" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Exclusive
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/wishlist" className="text-sm font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/loyalty" className="text-sm font-medium hover:text-primary transition-colors">
              Rewards
            </Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search premium products..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {state.user ? (
              <UserMenu />
            ) : (
              <AuthModal>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </AuthModal>
            )}

            <ShoppingCartComponent />
          </div>
        </div>

        {/* Category navigation */}
        <div className="hidden lg:flex h-12 items-center gap-8 border-b text-sm">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase().replace(' ', '-')}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category}
            </Link>
          ))}
          <Link
            href="/categories"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </header>
  );
}
