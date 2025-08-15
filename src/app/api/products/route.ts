import { NextRequest, NextResponse } from 'next/server';
import { spocketAPI } from '@/lib/spocket-api';
import { printfulAPI } from '@/lib/printful-api';
import { supplierTracker } from '@/lib/supplier-performance';

// This API route runs dynamically
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = searchParams.get('page') || '1';
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') || 'auto'; // 'auto', 'spocket', 'printful', 'all'

    console.log(`Fetching products from ${source} source...`);

    let allProducts: any[] = [];
    let sources: string[] = [];
    const errors: string[] = [];

    // Determine which suppliers to use
    const activeSuppliers = supplierTracker.getActiveSuppliers();
    const supplierTiers = supplierTracker.getSuppliersByTier();

    console.log(`🔍 Active suppliers: ${activeSuppliers.length}`);
    console.log(`📊 Elite suppliers: ${supplierTiers.elite.length}, Good: ${supplierTiers.good.length}, Poor: ${supplierTiers.poor.length}`);

    if (source === 'auto' || source === 'all') {
      // Prioritize suppliers based on performance
      const shouldUsePrintful = !supplierTracker.isBlacklisted('printful');
      const shouldUseSpocket = !supplierTracker.isBlacklisted('spocket');

      // Try Printful first (usually higher quality)
      if (shouldUsePrintful && (source === 'all' || source === 'auto')) {
        try {
          console.log('🖨️ Fetching from Printful...');
          const printfulData = await printfulAPI.fetchProducts({
            category: category || undefined,
            limit: Math.ceil(limit / 2),
            offset: (parseInt(page) - 1) * Math.ceil(limit / 2)
          });

          if (printfulData.products.length > 0) {
            allProducts.push(...printfulData.products);
            sources.push('printful');
            console.log(`✅ Printful: ${printfulData.products.length} products`);

            // Track successful integration
            await supplierTracker.trackOrder('printful', `fetch_${Date.now()}`, true);
          }
        } catch (error) {
          console.error('❌ Printful API error:', error);
          errors.push('Printful API failed');

          // Track failed integration
          await supplierTracker.trackOrder('printful', `fetch_${Date.now()}`, false);
          await supplierTracker.reportIncident({
            supplierId: 'printful',
            orderId: `fetch_${Date.now()}`,
            type: 'communication_issue',
            severity: 'medium',
            description: `API fetch failed: ${(error as Error).message}`,
            impact: 3
          });
        }
      }

      // Try Spocket
      if (shouldUseSpocket && (source === 'all' || (source === 'auto' && allProducts.length < limit))) {
        try {
          console.log('🚀 Fetching from Spocket...');
          const spocketData = await spocketAPI.fetchProducts({
            category: category || undefined,
            min_price: minPrice ? parseInt(minPrice) : undefined,
            max_price: maxPrice ? parseInt(maxPrice) : undefined,
            page: parseInt(page),
            per_page: Math.ceil(limit / 2),
          });

          if (spocketData.products.length > 0) {
            allProducts.push(...spocketData.products);
            sources.push('spocket');
            console.log(`✅ Spocket: ${spocketData.products.length} products`);

            // Track successful integration
            await supplierTracker.trackOrder('spocket', `fetch_${Date.now()}`, true);
          }
        } catch (error) {
          console.error('❌ Spocket API error:', error);
          errors.push('Spocket API failed');

          // Track failed integration
          await supplierTracker.trackOrder('spocket', `fetch_${Date.now()}`, false);
          await supplierTracker.reportIncident({
            supplierId: 'spocket',
            orderId: `fetch_${Date.now()}`,
            type: 'communication_issue',
            severity: 'medium',
            description: `API fetch failed: ${(error as Error).message}`,
            impact: 3
          });
        }
      }
    } else if (source === 'printful') {
      // Printful only
      if (!supplierTracker.isBlacklisted('printful')) {
        try {
          const printfulData = await printfulAPI.fetchProducts({
            category: category || undefined,
            limit,
            offset: (parseInt(page) - 1) * limit
          });

          allProducts = printfulData.products;
          sources = ['printful'];
          await supplierTracker.trackOrder('printful', `fetch_${Date.now()}`, true);
        } catch (error) {
          console.error('Printful API error:', error);
          errors.push('Printful API failed');
          await supplierTracker.trackOrder('printful', `fetch_${Date.now()}`, false);
        }
      } else {
        errors.push('Printful is blacklisted');
      }
    } else if (source === 'spocket') {
      // Spocket only
      if (!supplierTracker.isBlacklisted('spocket')) {
        try {
          const spocketData = await spocketAPI.fetchProducts({
            category: category || undefined,
            min_price: minPrice ? parseInt(minPrice) : undefined,
            max_price: maxPrice ? parseInt(maxPrice) : undefined,
            page: parseInt(page),
            per_page: limit,
          });

          allProducts = spocketData.products;
          sources = ['spocket'];
          await supplierTracker.trackOrder('spocket', `fetch_${Date.now()}`, true);
        } catch (error) {
          console.error('Spocket API error:', error);
          errors.push('Spocket API failed');
          await supplierTracker.trackOrder('spocket', `fetch_${Date.now()}`, false);
        }
      } else {
        errors.push('Spocket is blacklisted');
      }
    }

    // If no products from suppliers, fall back to demo data
    if (allProducts.length === 0) {
      console.log('🔄 Falling back to demo products...');
      const { products: demoProducts } = await import('@/lib/products');

      // Filter demo products based on criteria
      let filteredProducts = demoProducts;

      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
      }

      const startIndex = (parseInt(page) - 1) * limit;
      allProducts = filteredProducts.slice(startIndex, startIndex + limit);
      sources = ['demo'];
    }

    // Limit results and shuffle for variety
    if (allProducts.length > limit) {
      // Shuffle array for variety when combining sources
      allProducts = allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    }

    // Add performance scores to products
    const enhancedProducts = allProducts.map(product => {
      const supplierReport = supplierTracker.getSupplierReport(product.supplierName || 'unknown');

      return {
        ...product,
        supplierPerformance: supplierReport ? {
          overallScore: supplierTracker['calculateOverallScore'](supplierReport),
          qualityScore: supplierReport.qualityScore,
          onTimeDelivery: supplierReport.onTimeDelivery,
          customerSatisfaction: supplierReport.customerSatisfaction,
          isBlacklisted: !!supplierTracker.isBlacklisted(product.supplierName || 'unknown')
        } : null
      };
    });

    const response = {
      success: true,
      products: enhancedProducts,
      total: allProducts.length,
      page: parseInt(page),
      sources,
      supplierStats: {
        activeSuppliers: activeSuppliers.length,
        blacklistedSuppliers: Array.from(supplierTracker['blacklist'].keys()),
        supplierTiers,
        recentIncidents: supplierTracker.getRecentIncidents(undefined, 7).length
      },
      errors: errors.length > 0 ? errors : undefined
    };

    console.log(`📦 Returning ${enhancedProducts.length} products from sources: ${sources.join(', ')}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Products API error:', error);

    // Ultimate fallback to demo products
    try {
      const { products: demoProducts } = await import('@/lib/products');
      return NextResponse.json({
        success: true,
        products: demoProducts.slice(0, 20),
        total: demoProducts.length,
        page: 1,
        sources: ['demo'],
        error: 'All supplier APIs failed - using demo products',
        supplierStats: {
          activeSuppliers: 0,
          blacklistedSuppliers: [],
          supplierTiers: { elite: [], good: [], poor: [] },
          recentIncidents: 0
        }
      });
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        error: 'All product sources failed',
        products: [],
        total: 0,
        page: 1,
        sources: []
      }, { status: 500 });
    }
  }
}
