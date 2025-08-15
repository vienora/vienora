// Main automation system integration
// This file exports all automation functionality for easy integration

export * from './product-sync';
export * from './database-schema';
export * from './cron-jobs';
export * from './demo-runner';

import { productCurationEngine } from './product-sync';
import { automatedProductDB } from './database-schema';
import { cronJobManager, startAutomation, stopAutomation } from './cron-jobs';
import { automationDemo, runQuickDemo } from './demo-runner';

// Main automation controller
export class VienoraAutomation {
  // System status
  async getSystemStatus() {
    return {
      automation: cronJobManager.getSystemStatus(),
      database: {
        connected: true, // In production, check actual DB connection
        lastBackup: new Date().toISOString()
      },
      performance: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }

  // Start complete automation system
  async start() {
    console.log('🚀 Starting Vienora Automation System...');

    try {
      await startAutomation();
      console.log('✅ Automation system started successfully');

      return {
        success: true,
        message: 'Vienora automation system is now running',
        status: await this.getSystemStatus()
      };
    } catch (error: any) {
      console.error('❌ Failed to start automation:', error);
      throw error;
    }
  }

  // Stop automation system
  async stop() {
    console.log('🛑 Stopping Vienora Automation System...');

    try {
      stopAutomation();
      console.log('✅ Automation system stopped successfully');

      return {
        success: true,
        message: 'Vienora automation system has been stopped'
      };
    } catch (error: any) {
      console.error('❌ Failed to stop automation:', error);
      throw error;
    }
  }

  // Run demonstration
  async runDemo() {
    return await automationDemo.runFullDemo();
  }

  // Health check
  async healthCheck() {
    const status = await this.getSystemStatus();

    return {
      healthy: status.automation.isRunning,
      timestamp: new Date().toISOString(),
      details: status
    };
  }
}

// Export singleton instance
export const vienoraAutomation = new VienoraAutomation();

// Export key components for direct access
export {
  productCurationEngine,
  automatedProductDB,
  cronJobManager,
  automationDemo,
  runQuickDemo
};

// Utility functions
export const AutomationUtils = {
  // Format currency for luxury pricing
  formatLuxuryPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  // Calculate quality score badge color
  getQualityScoreColor: (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  },

  // Generate product slug
  generateSlug: (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  // Calculate estimated revenue
  calculateRevenue: (price: number, qualityScore: number): number => {
    const baseConversion = 0.05; // 5% base conversion
    const qualityMultiplier = qualityScore / 100;
    const estimatedOrders = 10; // Estimated monthly orders

    return price * baseConversion * qualityMultiplier * estimatedOrders;
  },

  // Format time ago
  timeAgo: (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  }
};

// Configuration constants
export const AutomationConfig = {
  QUALITY_THRESHOLDS: {
    AUTO_APPROVE: 70,
    REVIEW_QUEUE: 50,
    AUTO_REJECT: 30
  },

  PRICING: {
    MIN_LUXURY_PRICE: 50,
    MAX_LUXURY_PRICE: 5000,
    MARKUP_MULTIPLIERS: {
      LOW: 2.5,
      MEDIUM: 2.0,
      HIGH: 1.8,
      PREMIUM: 1.5
    }
  },

  SUPPLIERS: {
    PREFERRED_LOCATIONS: ['US', 'CA', 'GB', 'DE', 'FR', 'AU'],
    MAX_PROCESSING_DAYS: 3,
    MIN_RATING: 4.5
  },

  AUTOMATION: {
    SYNC_FREQUENCY: '0 2 * * *', // Daily at 2 AM
    BATCH_SIZE: 100,
    MAX_RETRIES: 3
  }
};

// Type exports for TypeScript support
export type {
  CuratedProduct,
  QualityMetrics,
  QualityThresholds,
  AutomatedProduct,
  ReviewQueueItem,
  CurationReport,
  CronJobConfig,
  CronJobResult,
  DemoResults
} from './product-sync';

// Default export
export default vienoraAutomation;
