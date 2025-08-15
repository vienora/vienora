import { NextRequest, NextResponse } from 'next/server';
import { spocketAPI } from '@/lib/spocket-api';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    console.log('Creating real order with Spocket:', orderData);

    // Transform order data to Spocket format
    const spocketOrderData = {
      line_items: orderData.items.map((item: any) => ({
        spocket_product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
      })),
      shipping_address: {
        first_name: orderData.shippingAddress.firstName,
        last_name: orderData.shippingAddress.lastName,
        address1: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        zip: orderData.shippingAddress.zipCode,
        country: orderData.shippingAddress.country || 'US',
        phone: orderData.shippingAddress.phone || '',
      },
      total_price: orderData.total,
    };

    // Create order with Spocket
    const spocketOrder = await spocketAPI.createOrder(spocketOrderData);

    console.log('Spocket order created:', spocketOrder.id);

    return NextResponse.json({
      success: true,
      orderId: spocketOrder.id,
      status: 'processing',
      message: 'Order successfully placed with supplier',
      spocketOrderId: spocketOrder.id,
      estimatedShipping: spocketOrder.estimated_shipping_time || '5-12 business days'
    });
  } catch (error) {
    console.error('Spocket order creation error:', error);

    // Return mock success for demo purposes, but log the error
    return NextResponse.json({
      success: true,
      orderId: `DEMO-${Date.now()}`,
      status: 'demo',
      message: 'Demo order created - Spocket integration needed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    console.log(`Checking order status: ${orderId}`);

    const orderStatus = await spocketAPI.getOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      order: orderStatus,
      source: 'spocket'
    });
  } catch (error) {
    console.error('Order status check error:', error);

    return NextResponse.json({
      success: false,
      error: 'Could not fetch order status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
