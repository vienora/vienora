import { NextRequest, NextResponse } from 'next/server';
import { spocketAPI } from '@/lib/spocket-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;

  try {
    console.log(`Fetching product ${productId} from Spocket...`);

    const product = await spocketAPI.getProduct(productId);

    return NextResponse.json({
      success: true,
      product,
      source: 'spocket'
    });
  } catch (error) {
    console.error('Spocket product fetch error:', error);

    // Fallback to demo product if Spocket fails
    const { products } = await import('@/lib/products');
    const demoProduct = products.find(p => p.id === productId) || products[0];

    return NextResponse.json({
      success: true,
      product: demoProduct,
      source: 'demo',
      error: 'Using demo product - Spocket connection failed'
    });
  }
}
