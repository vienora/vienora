'use client';

import { useState, useEffect } from 'react';
import ClientOnly from './ClientOnly';
import SafeLoading from './SafeLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  BellRing,
  Crown,
  Star,
  Sparkles,
  Clock,
  Eye,
  Shield,
  Zap,
  Settings,
  Check,
  X,
  AlertTriangle,
  Gift,
  Heart,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

interface NotificationSettings {
  limitedEdition: boolean;
  priceDrops: boolean;
  backInStock: boolean;
  exclusiveAccess: boolean;
  auctionAlerts: boolean;
  wishlistUpdates: boolean;
  curatorPicks: boolean;
  membershipUpdates: boolean;
  eventInvitations: boolean;
  personalizedOffers: boolean;
}

interface NotificationAlert {
  id: string;
  type: 'limited_edition' | 'price_drop' | 'back_in_stock' | 'exclusive_access' | 'auction' | 'wishlist' | 'curator' | 'membership' | 'event' | 'offer';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  productId?: string;
  imageUrl?: string;
  actionUrl?: string;
  expiresAt?: Date;
}

interface LuxuryNotificationsProps {
  userId: string;
  userTier: 'elite' | 'prestige' | 'sovereign';
  isVipMember: boolean;
}

export default function LuxuryNotifications({ userId, userTier, isVipMember }: LuxuryNotificationsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    limitedEdition: true,
    priceDrops: true,
    backInStock: true,
    exclusiveAccess: true,
    auctionAlerts: true,
    wishlistUpdates: true,
    curatorPicks: true,
    membershipUpdates: true,
    eventInvitations: true,
    personalizedOffers: true
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: '1',
      type: 'limited_edition',
      title: 'Ultra-Rare Patek Philippe Available',
      message: 'Limited to 50 pieces worldwide. VIP early access for 24 hours only.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      priority: 'urgent',
      productId: 'patek-limited-001',
      imageUrl: 'https://images.unsplash.com/photo-1548068437-d35155d9ecdd?w=100&h=100&fit=crop',
      actionUrl: '/product/patek-limited-001',
      expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'curator',
      title: 'New Curator Selection: Modern Masters',
      message: 'Isabella Sterling has curated 12 exceptional contemporary pieces for our Sovereign members.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      priority: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      actionUrl: '/collections/curator-modern-masters'
    },
    {
      id: '3',
      type: 'price_drop',
      title: 'Price Alert: Hermès Birkin Bag',
      message: 'Your wishlist item has dropped by 15% - now $28,500',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      priority: 'medium',
      productId: 'hermes-birkin-001',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
      actionUrl: '/product/hermes-birkin-001'
    },
    {
      id: '4',
      type: 'event',
      title: 'Private Viewing Invitation',
      message: 'You\'re invited to an exclusive preview of Renaissance masterpieces, December 20th.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
      priority: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0a9ba3fe1f3?w=100&h=100&fit=crop',
      actionUrl: '/events/renaissance-preview'
    }
  ]);

  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        setNotificationsEnabled(permission === 'granted');

        if (permission === 'granted') {
          // Register service worker for push notifications
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
          }
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if (notificationsEnabled) {
      new Notification('Vienora - Limited Edition Alert', {
        body: 'Rare 1960s Rolex Submariner now available - VIP early access',
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        tag: 'luxury-alert',
        requireInteraction: true
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'limited_edition': return Sparkles;
      case 'price_drop': return TrendingUp;
      case 'back_in_stock': return Check;
      case 'exclusive_access': return Crown;
      case 'auction': return Award;
      case 'wishlist': return Heart;
      case 'curator': return Star;
      case 'membership': return Shield;
      case 'event': return Calendar;
      case 'offer': return Gift;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ClientOnly fallback={<SafeLoading message="Loading VIP notifications..." variant="card" />}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BellRing className="w-8 h-8 text-amber-600" />
            Luxury Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay informed about exclusive opportunities and limited editions</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
          <Button onClick={sendTestNotification} disabled={!notificationsEnabled}>
            <Bell className="w-4 h-4 mr-2" />
            Test Alert
          </Button>
        </div>
      </div>

      {/* Permission Status */}
      <Card className={`${
        permissionStatus === 'granted' ? 'bg-green-50 border-green-200' :
        permissionStatus === 'denied' ? 'bg-red-50 border-red-200' :
        'bg-yellow-50 border-yellow-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {permissionStatus === 'granted' && <Check className="w-5 h-5 text-green-600" />}
              {permissionStatus === 'denied' && <X className="w-5 h-5 text-red-600" />}
              {permissionStatus === 'default' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
              <div>
                <p className="font-semibold">
                  {permissionStatus === 'granted' && 'Notifications Enabled'}
                  {permissionStatus === 'denied' && 'Notifications Blocked'}
                  {permissionStatus === 'default' && 'Enable Notifications'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {permissionStatus === 'granted' && 'You\'ll receive alerts for limited editions and exclusive access'}
                  {permissionStatus === 'denied' && 'Please enable notifications in your browser settings'}
                  {permissionStatus === 'default' && 'Get instant alerts for luxury items and exclusive opportunities'}
                </p>
              </div>
            </div>
            {permissionStatus !== 'granted' && (
              <Button onClick={requestNotificationPermission}>
                Enable Notifications
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">
            Recent Alerts
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="schedule">Alert Schedule</TabsTrigger>
        </TabsList>

        {/* Recent Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">We'll notify you about exclusive opportunities and limited editions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <Card key={notification.id} className={`${
                    !notification.isRead ? 'border-amber-200 bg-amber-50' : ''
                  } hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {notification.imageUrl && (
                          <img
                            src={notification.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-amber-600" />
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toISOString().slice(0, 19).replace('T', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              {notification.expiresAt && (
                                <span className="text-xs text-red-600 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Expires {new Date(notification.expiresAt).toISOString().slice(0, 10)}
                                </span>
                              )}
                              {notification.actionUrl && (
                                <Button size="sm" className="h-6 text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-800">Product Alerts</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Limited Editions</p>
                      <p className="text-xs text-muted-foreground">Rare and exclusive item releases</p>
                    </div>
                    <Switch
                      checked={settings.limitedEdition}
                      onCheckedChange={(checked: boolean) => updateSetting('limitedEdition', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Price Drops</p>
                      <p className="text-xs text-muted-foreground">Wishlist item price reductions</p>
                    </div>
                    <Switch
                      checked={settings.priceDrops}
                      onCheckedChange={(checked: boolean) => updateSetting('priceDrops', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Back in Stock</p>
                      <p className="text-xs text-muted-foreground">Previously unavailable items</p>
                    </div>
                    <Switch
                      checked={settings.backInStock}
                      onCheckedChange={(checked: boolean) => updateSetting('backInStock', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Exclusive Access</p>
                      <p className="text-xs text-muted-foreground">VIP early access opportunities</p>
                    </div>
                    <Switch
                      checked={settings.exclusiveAccess}
                      onCheckedChange={(checked: boolean) => updateSetting('exclusiveAccess', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auction Alerts</p>
                      <p className="text-xs text-muted-foreground">Auction start and end notifications</p>
                    </div>
                    <Switch
                      checked={settings.auctionAlerts}
                      onCheckedChange={(checked: boolean) => updateSetting('auctionAlerts', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-800">Service Alerts</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Wishlist Updates</p>
                      <p className="text-xs text-muted-foreground">Changes to your saved items</p>
                    </div>
                    <Switch
                      checked={settings.wishlistUpdates}
                      onCheckedChange={(checked: boolean) => updateSetting('wishlistUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Curator Picks</p>
                      <p className="text-xs text-muted-foreground">Expert recommendations and selections</p>
                    </div>
                    <Switch
                      checked={settings.curatorPicks}
                      onCheckedChange={(checked: boolean) => updateSetting('curatorPicks', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Membership Updates</p>
                      <p className="text-xs text-muted-foreground">Tier changes and benefits</p>
                    </div>
                    <Switch
                      checked={settings.membershipUpdates}
                      onCheckedChange={(checked: boolean) => updateSetting('membershipUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Invitations</p>
                      <p className="text-xs text-muted-foreground">Private viewings and exclusive events</p>
                    </div>
                    <Switch
                      checked={settings.eventInvitations}
                      onCheckedChange={(checked: boolean) => updateSetting('eventInvitations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Personalized Offers</p>
                      <p className="text-xs text-muted-foreground">Tailored promotions and opportunities</p>
                    </div>
                    <Switch
                      checked={settings.personalizedOffers}
                      onCheckedChange={(checked: boolean) => updateSetting('personalizedOffers', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">VIP Member Benefits</h4>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Priority notifications for ultra-rare items</li>
                  <li>• 24-hour early access alerts</li>
                  <li>• Personal curator recommendations</li>
                  <li>• Exclusive event invitations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Schedule */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium">Limited Edition Watch Drop</p>
                      <p className="text-sm text-muted-foreground">Vintage Rolex Collection Preview</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Dec 20, 2024</p>
                    <p className="text-sm text-muted-foreground">2:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Private Gallery Opening</p>
                      <p className="text-sm text-muted-foreground">Contemporary Masters Exhibition</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Dec 22, 2024</p>
                    <p className="text-sm text-muted-foreground">7:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Sovereign Auction Preview</p>
                      <p className="text-sm text-muted-foreground">Rare Gemstones & Jewelry</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Dec 25, 2024</p>
                    <p className="text-sm text-muted-foreground">10:00 AM EST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ClientOnly>
  );
}
