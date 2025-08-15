import { NextRequest, NextResponse } from 'next/server';
import { supplierTracker } from '@/lib/supplier-performance';

// Track a return event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      orderId,
      productId,
      supplierId,
      customerId,
      returnReason,
      returnType = 'refund',
      orderValue,
      refundAmount,
    } = body;

    if (!orderId || !productId || !supplierId || !customerId || !returnReason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine if this is a quality issue and supplier fault
    const qualityIssue = ['defective', 'not-as-described', 'damaged-shipping', 'wrong-item'].includes(returnReason);
    const supplierFault = ['defective', 'not-as-described', 'wrong-item'].includes(returnReason);

    // Determine severity level
    const severityLevel = returnReason === 'defective' ? 'high' :
                         returnReason === 'not-as-described' ? 'medium' :
                         returnReason === 'wrong-item' ? 'medium' : 'low';

    // Record the return event as an incident and track the order failure
    await supplierTracker.trackOrder(supplierId, orderId, false); // Mark as failed order due to return

    if (qualityIssue && supplierFault) {
      await supplierTracker.reportIncident({
        supplierId,
        orderId,
        type: 'quality_issue',
        severity: severityLevel as any,
        description: `Return due to ${returnReason}: ${body.description || 'Customer return'}`,
        impact: severityLevel === 'high' ? 7 : severityLevel === 'medium' ? 5 : 3
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Return tracked successfully',
      impact: qualityIssue ? 'Supplier performance affected' : 'Customer-initiated return'
    });

  } catch (error) {
    console.error('Return tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track return' },
      { status: 500 }
    );
  }
}

// Get return statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');
    const timeframe = searchParams.get('timeframe') || '30'; // days

    if (!supplierId) {
      return NextResponse.json(
        { success: false, error: 'Supplier ID required' },
        { status: 400 }
      );
    }

    // Get supplier performance score
    const supplierReport = supplierTracker.getSupplierReport(supplierId);
    const performanceScore = supplierReport ? supplierTracker['calculateOverallScore'](supplierReport) : 0;

    // Check if blacklisted
    const blacklistEntry = supplierTracker.isBlacklisted(supplierId);
    const isBlacklisted = !!blacklistEntry;

    return NextResponse.json({
      success: true,
      supplierId,
      performanceScore,
      isBlacklisted,
      timeframe: `${timeframe} days`,
      message: isBlacklisted ? 'Supplier is currently blacklisted' : 'Supplier is active'
    });

  } catch (error) {
    console.error('Return stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get return statistics' },
      { status: 500 }
    );
  }
}
