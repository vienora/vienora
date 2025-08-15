import { NextRequest, NextResponse } from 'next/server';
import { supplierTracker } from '@/lib/supplier-performance';

// This API route runs dynamically
export const dynamic = 'force-dynamic';

// GET /api/suppliers - Get supplier performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const supplierId = searchParams.get('supplierId');

    switch (action) {
      case 'rankings':
        // Get all suppliers ranked by performance
        const rankings = supplierTracker.getSupplierRankings();
        return NextResponse.json({
          success: true,
          data: rankings
        });

      case 'tiers':
        // Get suppliers organized by performance tiers
        const tiers = supplierTracker.getSuppliersByTier();
        return NextResponse.json({
          success: true,
          data: tiers
        });

      case 'active':
        // Get only active (non-blacklisted) suppliers
        const activeSuppliers = supplierTracker.getActiveSuppliers();
        return NextResponse.json({
          success: true,
          data: activeSuppliers
        });

      case 'blacklist':
        // Get blacklisted suppliers
        const blacklistEntries = Array.from(supplierTracker['blacklist'].entries()).map(([id, entry]) => ({
          ...entry,
          supplierId: id
        }));
        return NextResponse.json({
          success: true,
          data: blacklistEntries
        });

      case 'incidents':
        // Get recent incidents
        const days = parseInt(searchParams.get('days') || '30');
        const incidentsList = supplierTracker.getRecentIncidents(supplierId || undefined, days);
        return NextResponse.json({
          success: true,
          data: incidentsList
        });

      case 'report':
        // Get detailed report for specific supplier
        if (!supplierId) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID required for report'
          }, { status: 400 });
        }

        const report = supplierTracker.getSupplierReport(supplierId);
        const reportIncidents = supplierTracker.getRecentIncidents(supplierId, 90);
        const blacklistStatus = supplierTracker.isBlacklisted(supplierId);

        return NextResponse.json({
          success: true,
          data: {
            metrics: report,
            incidents: reportIncidents,
            blacklistStatus,
            overallScore: report ? supplierTracker['calculateOverallScore'](report) : 0
          }
        });

      default:
        // Get overview of all supplier data
        const overview = {
          totalSuppliers: supplierTracker.getSupplierRankings().length,
          activeSuppliers: supplierTracker.getActiveSuppliers().length,
          blacklistedSuppliers: Array.from(supplierTracker['blacklist'].keys()).length,
          recentIncidents: supplierTracker.getRecentIncidents(undefined, 7).length,
          supplierTiers: supplierTracker.getSuppliersByTier(),
          topPerformers: supplierTracker.getActiveSuppliers().slice(0, 5)
        };

        return NextResponse.json({
          success: true,
          data: overview
        });
    }

  } catch (error) {
    console.error('Supplier API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch supplier data'
    }, { status: 500 });
  }
}

// POST /api/suppliers - Manage supplier actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, supplierId, ...params } = body;

    switch (action) {
      case 'blacklist':
        // Add supplier to blacklist
        const { reason, severity: blacklistSeverity = 'warning', expiresAt, blacklistedBy = 'admin' } = params;

        if (!supplierId || !reason) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID and reason required'
          }, { status: 400 });
        }

        await supplierTracker.blacklistSupplier(
          supplierId,
          reason,
          blacklistSeverity,
          expiresAt ? new Date(expiresAt) : undefined,
          blacklistedBy
        );

        return NextResponse.json({
          success: true,
          message: `Supplier ${supplierId} blacklisted: ${reason}`
        });

      case 'remove_blacklist':
        // Remove supplier from blacklist
        if (!supplierId) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID required'
          }, { status: 400 });
        }

        const removed = await supplierTracker.removeFromBlacklist(supplierId);

        return NextResponse.json({
          success: true,
          message: removed ?
            `Supplier ${supplierId} removed from blacklist` :
            `Supplier ${supplierId} was not blacklisted`
        });

      case 'report_incident':
        // Report a new incident
        const { orderId, type, severity: incidentSeverity, description, impact } = params;

        if (!supplierId || !type || !description) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID, type, and description required'
          }, { status: 400 });
        }

        const incidentId = await supplierTracker.reportIncident({
          supplierId,
          orderId: orderId || `manual_${Date.now()}`,
          type,
          severity: incidentSeverity || 'medium',
          description,
          impact: impact || 5
        });

        return NextResponse.json({
          success: true,
          message: 'Incident reported successfully',
          incidentId
        });

      case 'track_order':
        // Track order success/failure
        const { orderId: trackOrderId, success, shippingDays } = params;

        if (!supplierId || success === undefined) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID and success status required'
          }, { status: 400 });
        }

        await supplierTracker.trackOrder(
          supplierId,
          trackOrderId || `order_${Date.now()}`,
          success,
          shippingDays
        );

        return NextResponse.json({
          success: true,
          message: `Order tracking updated for supplier ${supplierId}`
        });

      case 'simulate_performance_data':
        // Simulate some performance data for testing
        if (!supplierId) {
          return NextResponse.json({
            success: false,
            error: 'Supplier ID required'
          }, { status: 400 });
        }

        // Simulate some orders and incidents
        const orderCount = 50 + Math.floor(Math.random() * 100);
        const successRate = 0.7 + Math.random() * 0.3; // 70-100% success rate

        for (let i = 0; i < orderCount; i++) {
          const isSuccess = Math.random() < successRate;
          const shippingDays = isSuccess ? 3 + Math.random() * 7 : undefined;

          await supplierTracker.trackOrder(
            supplierId,
            `sim_order_${i}_${Date.now()}`,
            isSuccess,
            shippingDays
          );
        }

        // Simulate some incidents
        const incidentTypes = ['quality_issue', 'late_shipping', 'out_of_stock', 'communication_issue', 'price_change'];
        const severities = ['low', 'medium', 'high'];
        const incidentCount = Math.floor(Math.random() * 10);

        for (let i = 0; i < incidentCount; i++) {
          await supplierTracker.reportIncident({
            supplierId,
            orderId: `sim_incident_${i}_${Date.now()}`,
            type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)] as any,
            severity: severities[Math.floor(Math.random() * severities.length)] as any,
            description: `Simulated ${incidentTypes[Math.floor(Math.random() * incidentTypes.length)]} incident`,
            impact: 1 + Math.floor(Math.random() * 8)
          });
        }

        return NextResponse.json({
          success: true,
          message: `Simulated ${orderCount} orders and ${incidentCount} incidents for supplier ${supplierId}`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Supplier management error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process supplier action'
    }, { status: 500 });
  }
}

// PUT /api/suppliers - Update supplier settings or thresholds
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'update_thresholds':
        // Update performance thresholds
        const { thresholds } = params;

        if (!thresholds) {
          return NextResponse.json({
            success: false,
            error: 'Thresholds object required'
          }, { status: 400 });
        }

        // Update thresholds in supplier tracker
        Object.assign(supplierTracker['thresholds'], thresholds);

        return NextResponse.json({
          success: true,
          message: 'Performance thresholds updated',
          newThresholds: supplierTracker['thresholds']
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Supplier update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update supplier settings'
    }, { status: 500 });
  }
}
