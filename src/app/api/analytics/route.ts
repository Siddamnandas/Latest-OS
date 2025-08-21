import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const timeRange = searchParams.get('timeRange') || 'month'; // week, month, quarter, year

    if (!coupleId) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Fetch analytics data
    const analytics = await db.analytics.findMany({
      where: {
        couple_id: coupleId,
        recorded_at: {
          gte: startDate
        }
      },
      orderBy: { recorded_at: 'desc' }
    });

    // Calculate aggregated metrics
    const metrics = {};
    analytics.forEach(analytic => {
      if (!metrics[analytic.metric_type]) {
        metrics[analytic.metric_type] = [];
      }
      metrics[analytic.metric_type].push(analytic.metric_value);
    });

    // Calculate averages and trends
    const aggregatedMetrics = Object.entries(metrics).map(([type, values]) => {
      const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      const latest = values[0];
      const previous = values[1];
      const trend = previous ? (latest > previous ? 'up' : latest < previous ? 'down' : 'stable') : 'stable';
      
      return {
        type,
        value: Math.round(avgValue * 100) / 100,
        trend,
        dataPoints: values.length
      };
    });

    // Get relationship health score
    const relationshipHealth = aggregatedMetrics.find(m => m.type === 'relationship_health')?.value || 75;
    
    // Get communication score
    const communicationScore = aggregatedMetrics.find(m => m.type === 'communication')?.value || 80;

    // Get recent activities
    const recentActivities = await db.syncEntry.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: startDate
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    // Get task completion rate
    const tasks = await db.task.findMany({
      where: {
        couple_id: coupleId,
        created_at: {
          gte: startDate
        }
      }
    });

    const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
    const taskCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    // Get ritual sessions
    const ritualSessions = await db.ritualSession.findMany({
      where: {
        couple_id: coupleId,
        started_at: {
          gte: startDate
        }
      }
    });

    const completedRituals = ritualSessions.filter(session => session.completed_at);
    const ritualCompletionRate = ritualSessions.length > 0 ? (completedRituals.length / ritualSessions.length) * 100 : 0;

    return NextResponse.json({
      analytics: aggregatedMetrics,
      summary: {
        relationshipHealth,
        communicationScore,
        taskCompletionRate: Math.round(taskCompletionRate),
        ritualCompletionRate: Math.round(ritualCompletionRate),
        totalActivities: recentActivities.length,
        activePeriod: timeRange
      },
      recentActivities,
      period: {
        start: startDate,
        end: now
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { coupleId, metricType, metricValue, targetValue, trend, contextData } = await request.json();

    if (!coupleId || !metricType || metricValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analytic = await db.analytics.create({
      data: {
        couple_id: coupleId,
        metric_type: metricType,
        metric_value: metricValue,
        target_value: targetValue || null,
        trend: trend || null,
        context_data: contextData || null
      }
    });

    return NextResponse.json({
      message: 'Analytics data saved successfully',
      analytic
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating analytic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}