'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

interface AuthState {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'LOAD_ORDERS'; orders: Order[] };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.user,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        orders: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.order, ...state.orders],
      };

    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.orders,
      };

    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  createOrder: (items: Array<{ productId: string; productName: string; quantity: number; price: number; image: string }>, total: number) => Promise<string>;
  getUserOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@trendluxdrops.com',
    name: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

const generateMockOrders = (userId: string): Order[] => [
  {
    id: 'ORD-001',
    userId,
    items: [
      {
        productId: '1',
        productName: 'Professional 4K Digital Camera',
        quantity: 1,
        price: 2899,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&h=150&fit=crop'
      }
    ],
    total: 2899,
    status: 'delivered',
    orderDate: '2025-01-05',
    deliveryDate: '2025-01-07',
    trackingNumber: 'TL1234567890'
  },
  {
    id: 'ORD-002',
    userId,
    items: [
      {
        productId: '2',
        productName: 'Premium Wireless Noise-Cancelling Headphones',
        quantity: 2,
        price: 449,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop'
      }
    ],
    total: 898,
    status: 'shipped',
    orderDate: '2025-01-06',
    trackingNumber: 'TL1234567891'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    orders: [],
    isLoading: false,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('trendlux-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN', user });
        // Load mock orders for demo
        const orders = generateMockOrders(user.id);
        dispatch({ type: 'LOAD_ORDERS', orders });
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, accept any email/password combo or use demo account
    const user = mockUsers.find(u => u.email === email) || {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
    };

    localStorage.setItem('trendlux-user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', user });

    // Load mock orders
    const orders = generateMockOrders(user.id);
    dispatch({ type: 'LOAD_ORDERS', orders });

    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', isLoading: true });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };

    localStorage.setItem('trendlux-user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', user });

    return true;
  };

  const logout = () => {
    localStorage.removeItem('trendlux-user');
    dispatch({ type: 'LOGOUT' });
  };

  const createOrder = async (
    items: Array<{ productId: string; productName: string; quantity: number; price: number; image: string }>,
    total: number
  ): Promise<string> => {
    if (!state.user) throw new Error('User not authenticated');

    const order: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: state.user.id,
      items,
      total,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      trackingNumber: `TL${Math.random().toString().substr(2, 10)}`,
    };

    dispatch({ type: 'ADD_ORDER', order });
    return order.id;
  };

  const getUserOrders = (): Order[] => {
    return state.orders;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    createOrder,
    getUserOrders,
    getOrderById,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
