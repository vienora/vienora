'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Package, LogOut, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { state, logout } = useAuth();

  if (!state.user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            {state.user.avatar ? (
              <img src={state.user.avatar} alt={state.user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {state.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {state.user.avatar ? (
                <img src={state.user.avatar} alt={state.user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-medium">
                  {state.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
            <div className="text-left">
              <div className="font-semibold">{state.user.name}</div>
              <div className="text-sm text-muted-foreground">{state.user.email}</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-700">{state.orders.length}</div>
              <div className="text-xs text-muted-foreground">Total Orders</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-yellow-700">
                {state.orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <div className="space-y-1">
            <Link href="/account/orders" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Package className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">My Orders</div>
                  <div className="text-xs text-muted-foreground">Track & manage orders</div>
                </div>
              </Button>
            </Link>

            <Link href="/account/wishlist" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Heart className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Wishlist</div>
                  <div className="text-xs text-muted-foreground">Saved items</div>
                </div>
              </Button>
            </Link>

            <Link href="/account/profile" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Account Settings</div>
                  <div className="text-xs text-muted-foreground">Profile & preferences</div>
                </div>
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Recent Orders */}
          <div>
            <h4 className="font-medium mb-3">Recent Orders</h4>
            <div className="space-y-2">
              {state.orders.slice(0, 2).map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`} onClick={() => setOpen(false)}>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} • ${order.total.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
