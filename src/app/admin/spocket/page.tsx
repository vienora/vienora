'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Package,
  Zap,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SpocketStatus {
  configured: boolean;
  apiKey: string;
  webhookSecret: string;
  apiStatus: string;
  productCount: number;
  lastSync: string;
  webhookUrl: string;
  error?: string;
}

export default function SpocketAdminPage() {
  const [status, setStatus] = useState<SpocketStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sync/spocket');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load Spocket status:', error);
      setStatus({
        configured: false,
        apiKey: 'error',
        webhookSecret: 'error',
        apiStatus: 'error',
        productCount: 0,
        lastSync: 'Unknown',
        webhookUrl: 'Error',
        error: 'Failed to load status'
      });
    } finally {
      setLoading(false);
    }
  };

  const runSync = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);

      const response = await fetch('/api/sync/spocket', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin_secret_key_123456'}`
        }
      });

      const result = await response.json();
      setSyncResult(result);

      if (result.success) {
        await loadStatus(); // Reload status after sync
      }
    } catch (error) {
      setSyncResult({
        success: false,
        error: 'Sync request failed'
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'missing':
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'missing':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading Spocket status...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-amber-600" />
            Spocket Integration Status
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your Spocket dropshipping integration
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Integration Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(status?.apiKey || 'missing')}
                <div>
                  <p className="font-medium">API Key</p>
                  <Badge className={getStatusColor(status?.apiKey || 'missing')}>
                    {status?.apiKey || 'Missing'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(status?.webhookSecret || 'missing')}
                <div>
                  <p className="font-medium">Webhook</p>
                  <Badge className={getStatusColor(status?.webhookSecret || 'missing')}>
                    {status?.webhookSecret || 'Missing'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(status?.apiStatus || 'disconnected')}
                <div>
                  <p className="font-medium">API Connection</p>
                  <Badge className={getStatusColor(status?.apiStatus || 'disconnected')}>
                    {status?.apiStatus || 'Disconnected'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Products</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {status?.productCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Status */}
        {!status?.configured && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Spocket not configured!</strong> Add your API credentials to .env.local to enable real product imports.
              See SPOCKET_SETUP.md for detailed instructions.
            </AlertDescription>
          </Alert>
        )}

        {status?.error && (
          <Alert className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {status.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Sync Controls */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Sync</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Sync</p>
                  <p className="text-sm text-muted-foreground">{status?.lastSync}</p>
                </div>
                <Button
                  onClick={runSync}
                  disabled={syncing || !status?.configured}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>

              {syncResult && (
                <Alert className={syncResult.success ? 'border-green-200' : 'border-red-200'}>
                  <AlertDescription>
                    {syncResult.success ? (
                      <>✅ Sync completed: {syncResult.updated} products updated</>
                    ) : (
                      <>❌ Sync failed: {syncResult.error}</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Webhook URL</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    {status?.webhookUrl}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add this URL to your Spocket dashboard under Settings → Webhooks
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={loadStatus}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>

              <Button variant="outline" asChild>
                <a href="/api/products" target="_blank">
                  <Package className="w-4 h-4 mr-2" />
                  Test Product API
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href="/admin" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Main Admin
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
