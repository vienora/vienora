import { NextRequest, NextResponse } from 'next/server';
import { supplierTracker } from '@/lib/supplier-performance';

// Report a quality issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      orderId,
      productId,
      supplierId,
      customerId,
      issueType,
      description,
      severityLevel = 'medium'
    } = body;

    if (!orderId || !productId || !supplierId || !customerId || !issueType || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Record the quality issue
    await supplierTracker.reportIncident({
      supplierId,
      orderId,
      type: 'quality_issue',
      severity: severityLevel as any,
      description: `${issueType}: ${description}`,
      impact: severityLevel === 'critical' ? 8 : severityLevel === 'high' ? 6 : severityLevel === 'medium' ? 4 : 2
    });

    // Determine impact message
    const impactMessage = severityLevel === 'critical' ? 'Critical issue - supplier may be blacklisted' :
                         severityLevel === 'high' ? 'High severity - significant impact on supplier score' :
                         severityLevel === 'medium' ? 'Moderate impact on supplier performance' :
                         'Minor issue recorded';

    return NextResponse.json({
      success: true,
      message: 'Quality issue reported successfully',
      severityLevel,
      impact: impactMessage
    });

  } catch (error) {
    console.error('Quality issue reporting error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to report quality issue' },
      { status: 500 }
    );
  }
}

// Get quality issue statistics
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

    // Get supplier performance data
    const supplierReport = supplierTracker.getSupplierReport(supplierId);
    const performanceScore = supplierReport ? supplierTracker['calculateOverallScore'](supplierReport) : 0;
    const blacklistEntry = supplierTracker.isBlacklisted(supplierId);
    const isBlacklisted = !!blacklistEntry;

    // Mock quality statistics (implement with real data)
    const mockStats = {
      totalIssues: Math.floor(Math.random() * 10),
      criticalIssues: Math.floor(Math.random() * 2),
      highSeverity: Math.floor(Math.random() * 3),
      resolvedIssues: Math.floor(Math.random() * 8),
      avgResolutionTime: Math.floor(Math.random() * 48) + 24 // 24-72 hours
    };

    return NextResponse.json({
      success: true,
      supplierId,
      performanceScore,
      isBlacklisted,
      timeframe: `${timeframe} days`,
      qualityStats: mockStats,
      status: isBlacklisted ? 'BLACKLISTED' :
              performanceScore < 50 ? 'WARNING' :
              performanceScore < 70 ? 'WATCH' : 'ACTIVE'
    });

  } catch (error) {
    console.error('Quality stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get quality statistics' },
      { status: 500 }
    );
  }
}
