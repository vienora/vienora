import { NextRequest, NextResponse } from 'next/server';
import { spocketAPI } from '@/lib/spocket-api';

// Manual sync endpoint for Spocket inventory
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    // Simple auth check (in production, use proper authentication)
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting Spocket inventory sync...');

    const result = await spocketAPI.syncInventory();

    console.log(`Sync completed: ${result.updated} products updated`);

    if (result.errors.length > 0) {
      console.warn('Sync errors:', result.errors);
    }

    return NextResponse.json({
      success: true,
      updated: result.updated,
      errors: result.errors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sync failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Get sync status
export async function GET(request: NextRequest) {
  try {
    // Check if Spocket is properly configured
    const hasApiKey = !!process.env.SPOCKET_API_KEY;
    const hasWebhookSecret = !!process.env.SPOCKET_WEBHOOK_SECRET;

    // Test API connection
    let apiStatus = 'disconnected';
    let productCount = 0;

    if (hasApiKey) {
      try {
        const testResult = await spocketAPI.fetchProducts({ per_page: 1 });
        apiStatus = 'connected';
        productCount = testResult.total;
      } catch (error) {
        apiStatus = 'error';
        console.error('Spocket API test failed:', error);
      }
    }

    return NextResponse.json({
      configured: hasApiKey && hasWebhookSecret,
      apiKey: hasApiKey ? 'configured' : 'missing',
      webhookSecret: hasWebhookSecret ? 'configured' : 'missing',
      apiStatus,
      productCount,
      lastSync: 'Manual sync required',
      webhookUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/webhooks/spocket`
    });
  } catch (error) {
    return NextResponse.json({
      configured: false,
      error: error instanceof Error ? error.message : 'Status check failed'
    }, { status: 500 });
  }
}
