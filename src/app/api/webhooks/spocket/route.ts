import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook handler for Spocket notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-spocket-signature');

    // Verify webhook signature
    if (!verifySpocketSignature(body, signature)) {
      console.error('Invalid Spocket webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    console.log('Spocket webhook received:', data.event_type);

    switch (data.event_type) {
      case 'order.shipped':
        await handleOrderShipped(data);
        break;

      case 'order.delivered':
        await handleOrderDelivered(data);
        break;

      case 'order.cancelled':
        await handleOrderCancelled(data);
        break;

      case 'inventory.updated':
        await handleInventoryUpdate(data);
        break;

      default:
        console.log('Unhandled webhook event:', data.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

function verifySpocketSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.SPOCKET_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.SPOCKET_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function handleOrderShipped(data: any) {
  console.log('Order shipped:', data.order_id);

  // Update order status in your database
  // Send customer notification email
  // Update tracking information

  // For now, just log the event
  console.log('Tracking number:', data.tracking_number);
  console.log('Shipping carrier:', data.shipping_carrier);
}

async function handleOrderDelivered(data: any) {
  console.log('Order delivered:', data.order_id);

  // Update order status
  // Send delivery confirmation
  // Request customer review
}

async function handleOrderCancelled(data: any) {
  console.log('Order cancelled:', data.order_id);

  // Update order status
  // Process refund if needed
  // Send cancellation notification
}

async function handleInventoryUpdate(data: any) {
  console.log('Inventory updated for product:', data.product_id);

  // Update product inventory in your database
  // Handle out-of-stock notifications
}

export const maxDuration = 30; // Vercel function timeout
