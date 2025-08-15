'use client';

import { useState, useEffect, useRef } from 'react';
import ClientOnly from './ClientOnly';
import SafeLoading from './SafeLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  MessageCircle,
  Crown,
  Award,
  Star,
  Send,
  Minimize2,
  X,
  Phone,
  Video,
  Paperclip,
  Smile,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'product';
  metadata?: {
    productId?: string;
    imageUrl?: string;
    priority?: 'normal' | 'high' | 'urgent';
  };
}

interface ConciergeAgent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  rating: number;
  isOnline: boolean;
  responseTime: string;
}

interface VipConciergeProps {
  userTier: 'elite' | 'prestige' | 'sovereign';
  isVipMember: boolean;
}

const conciergeAgents: ConciergeAgent[] = [
  {
    id: '1',
    name: 'Isabella Sterling',
    title: 'Senior Luxury Curator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
    specialties: ['Fine Art', 'Jewelry', 'Rare Collections'],
    rating: 4.9,
    isOnline: true,
    responseTime: '< 30 seconds'
  },
  {
    id: '2',
    name: 'Alexander Dubois',
    title: 'Elite Concierge Specialist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    specialties: ['Timepieces', 'Vehicles', 'Technology'],
    rating: 4.8,
    isOnline: true,
    responseTime: '< 1 minute'
  },
  {
    id: '3',
    name: 'Victoria Ashworth',
    title: 'Sovereign Account Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    specialties: ['Bespoke Services', 'Private Collections', 'Estate Curation'],
    rating: 5.0,
    isOnline: true,
    responseTime: 'Immediate'
  }
];

export default function VipConciergeChat({ userTier, isVipMember }: VipConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [assignedAgent, setAssignedAgent] = useState<ConciergeAgent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Assign agent based on user tier
    if (isVipMember && !assignedAgent) {
      let agent;
      switch (userTier) {
        case 'sovereign':
          agent = conciergeAgents.find(a => a.title.includes('Sovereign'));
          break;
        case 'prestige':
          agent = conciergeAgents.find(a => a.title.includes('Elite'));
          break;
        default:
          agent = conciergeAgents[0];
      }
      setAssignedAgent(agent || conciergeAgents[0]);
    }
  }, [userTier, isVipMember, assignedAgent]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message when chat opens
    if (isOpen && messages.length === 0 && assignedAgent) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        sender: 'concierge',
        message: `Welcome to Vienora's exclusive concierge service! I'm ${assignedAgent.name}, your personal luxury curator. How may I assist you with your exceptional acquisitions today?`,
        timestamp: new Date(),
        type: 'text',
        metadata: { priority: 'high' }
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, assignedAgent, messages.length]);

  const sendMessage = () => {
    if (!currentMessage.trim() || !assignedAgent) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: currentMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate concierge response
    setTimeout(() => {
      const responses = [
        "I'd be delighted to help you find the perfect piece. Let me review our exclusive collection for you.",
        "Excellent choice! I can arrange a private viewing of similar items in our vault.",
        "As a valued member, I can offer you early access to this collection before it's available to others.",
        "I'll personally ensure this item meets our highest standards before it reaches you.",
        "Would you like me to arrange white-glove delivery and professional installation for this piece?"
      ];

      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'concierge',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVipMember) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-full h-14 w-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-full h-16 w-16 shadow-xl relative"
        >
          <Crown className="w-8 h-8" />
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
            VIP
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-amber-200 ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {assignedAgent && (
                <>
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <img src={assignedAgent.avatar} alt={assignedAgent.name} className="w-full h-full object-cover" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-semibold">{assignedAgent.name}</CardTitle>
                    <p className="text-xs opacity-90">{assignedAgent.title}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white text-xs">
                <Star className="w-3 h-3 mr-1" />
                {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Agent Info */}
            {assignedAgent && (
              <div className="px-4 py-3 bg-amber-50 border-b">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online • Response time: {assignedAgent.responseTime}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground">
                    Specialties: {assignedAgent.specialties.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto h-80 p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                  } px-4 py-2`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-amber-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-r-lg rounded-tl-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Exclusive concierge service • Available 24/7 for VIP members
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
