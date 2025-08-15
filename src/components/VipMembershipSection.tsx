'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Star, CheckCircle2 } from 'lucide-react';

export default function VipMembershipSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interests: [] as string[],
    membershipLevel: 'elite'
  });

  const luxuryInterests = [
    { id: 'art', label: '🎨 Fine Art & Collectibles', icon: '🎨' },
    { id: 'timepieces', label: '⌚ Luxury Timepieces', icon: '⌚' },
    { id: 'jewelry', label: '💎 Precious Jewelry', icon: '💎' },
    { id: 'vehicles', label: '🏎️ Exotic Vehicles', icon: '🏎️' },
    { id: 'properties', label: '🏛️ Luxury Properties', icon: '🏛️' },
    { id: 'wines', label: '🍷 Rare Wines & Spirits', icon: '🍷' }
  ];

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(id => id !== interestId)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('VIP membership signup:', formData);
    // Handle form submission
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur border-amber-200">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-amber-600" />
              <CardTitle className="text-3xl font-bold">Join The Elite</CardTitle>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Receive first access to rare acquisitions, private sales, and exclusive opportunities
              reserved for our most valued members.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <Input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />

              {/* Luxury Interests */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold">Your Luxury Interests</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {luxuryInterests.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                      <Checkbox
                        id={interest.id}
                        checked={formData.interests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                        className="border-amber-500 text-amber-600"
                      />
                      <label
                        htmlFor={interest.id}
                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-lg">{interest.icon}</span>
                        {interest.label.replace(interest.icon + ' ', '')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Membership Level */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Membership Level</h3>
                <Tabs value={formData.membershipLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, membershipLevel: value }))}>
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger value="elite" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Elite
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="prestige" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Prestige
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="sovereign" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Sovereign
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="elite" className="mt-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-600" />
                        Elite
                      </h4>
                      <p className="text-gray-600 mb-4">Curated collections</p>
                      <div className="text-sm text-gray-600">
                        Perfect for discerning collectors seeking premium access to carefully curated luxury items.
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prestige" className="mt-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-600" />
                        Prestige
                      </h4>
                      <p className="text-gray-600 mb-4">Private auctions</p>
                      <div className="text-sm text-gray-600">
                        Exclusive access to private auctions and invitation-only events for serious collectors.
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sovereign" className="mt-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-600" />
                        Sovereign
                      </h4>
                      <p className="text-gray-600 mb-4">Bespoke service</p>
                      <div className="text-sm text-gray-600">
                        White-glove concierge service with bespoke acquisitions and private consultations.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-sm">🎁</span>
                  </div>
                  <h3 className="text-xl font-semibold">What You'll Receive</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Weekly curator insights and market analysis',
                    'First access to new luxury acquisitions',
                    'Exclusive private sale invitations',
                    'VIP event and gallery opening invites'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-12 py-4 text-lg font-semibold shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Join The Elite Circle
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
                By subscribing, you agree to receive exclusive communications from Vienora. Unsubscribe at any time.
                No spam, only luxury.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
