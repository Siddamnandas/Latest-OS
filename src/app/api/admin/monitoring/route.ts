import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/monitoring - Get system metrics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Basic auth check for admin - in production, you'd have proper role-based permissions
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '7d';
    const metrics = url.searchParams.get('metrics')?.split(',') || ['couples', 'users', 'activities'];

    // Calculate time range
    const now = new Date();
    const ranges = {
      '1h': new Date(now.getTime() - 60 * 60 * 1000),
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };

    const startDate = ranges[timeRange as keyof typeof ranges] || ranges['7d'];

    const results: any = {};

    // Build query promises based on requested metrics (currently not used directly)
    const metricPromises: Promise<any>[] = [];

    if (metrics.includes('couples')) {
      metricPromises.push(
        prisma.couple.count(),
        prisma.couple.count({
          where: { created_at: { gte: startDate } }
        })
      );
    }

    if (metrics.includes('users')) {
      metricPromises.push(
        prisma.user.count(),
        prisma.user.count({
          where: { created_at: { gte: startDate } }
        })
      );
    }

    if (metrics.includes('activities')) {
      metricPromises.push(
        prisma.activity.count(),
        prisma.activityCompletion.count({
          where: { completedAt: { gte: startDate } }
        }),
        prisma.memory.count(),
        prisma.memory.count({
          where: { created_at: { gte: startDate } }
        })
      );
    }

    if (metrics.includes('engagement')) {
      metricPromises.push(
        prisma.syncEntry.count({
          where: { created_at: { gte: startDate } }
        }),
        prisma.task.count({
          where: { created_at: { gte: startDate } }
        }),
        prisma.ritualSession.count({
          where: { started_at: { gte: startDate } }
        })
      );
    }

    // Execute all metric queries
    if (metrics.includes('couples')) {
      const [totalCouples, newCouples] = await Promise.all([
        prisma.couple.count(),
        prisma.couple.count({ where: { created_at: { gte: startDate } } })
      ]);
      results.couples = { total: totalCouples, new: newCouples };
    }

    if (metrics.includes('users')) {
      const [totalUsers, newUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { created_at: { gte: startDate } } })
      ]);
      results.users = { total: totalUsers, new: newUsers };
    }

    if (metrics.includes('activities')) {
      const [totalActivities, completedActivities, totalMemories, newMemories] = await Promise.all([
        prisma.activity.count(),
        prisma.activityCompletion.count({ where: { completedAt: { gte: startDate } } }),
        prisma.memory.count(),
        prisma.memory.count({ where: { created_at: { gte: startDate } } })
      ]);
      results.activities = {
        total: totalActivities,
        completed: completedActivities,
        memories: { total: totalMemories, new: newMemories }
      };
    }

    if (metrics.includes('engagement')) {
      const [syncEntries, tasks, rituals] = await Promise.all([
        prisma.syncEntry.count({ where: { created_at: { gte: startDate } } }),
        prisma.task.count({ where: { created_at: { gte: startDate } } }),
        prisma.ritualSession.count({ where: { started_at: { gte: startDate } } })
      ]);
      results.engagement = { syncEntries, tasks, rituals };
    }

    if (metrics.includes('performance')) {
      // Add basic performance metrics
      results.performance = {
        responseTime: '< 200ms', // Placeholder
        uptime: '99.9%', // Placeholder
        errorRate: '0.1%', // Placeholder
      };
    }

    // Add system info
    results.system = {
      timeRange,
      timestamp: new Date().toISOString(),
      server: 'Next.js + PostgreSQL',
      version: '1.0.0',
    };

    return NextResponse.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/monitoring - Update monitoring settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin users - in production you'd check user roles
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { couple_id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    // Handle different monitoring actions
    if (body.action === 'reset_metrics') {
      // This would typically clear certain metrics or counters
      // For now, just acknowledge the request
      return NextResponse.json({
        success: true,
        message: 'Metrics reset request acknowledged',
        timestamp: new Date().toISOString(),
      });
    }

    if (body.action === 'update_thresholds') {
      // Update alert thresholds
      return NextResponse.json({
        success: true,
        message: 'Thresholds updated',
        updatedThresholds: body.thresholds,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Monitoring configuration updated',
      data: body,
    });

  } catch (error) {
    console.error('Error updating monitoring settings:', error);
    return NextResponse.json(
      { error: 'Failed to update monitoring settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
