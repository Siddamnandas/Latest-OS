import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user privacy settings
    const privacySettings = await db.privacySetting.findUnique({
      where: { userId }
    });

    // Get security audit log
    const securityAudits = await db.securityAudit.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    // Calculate security score
    const securityScore = calculateSecurityScore(privacySettings);

    return NextResponse.json({
      settings: privacySettings,
      securityAudits,
      securityScore
    });
  } catch (error) {
    logger.error('Error fetching privacy settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, settings } = await request.json();

    if (!userId || !settings) {
      return NextResponse.json({ error: 'User ID and settings required' }, { status: 400 });
    }

    // Update privacy settings
    const updatedSettings = await db.privacySetting.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings
      }
    });

    // Log the settings change
    await db.securityAudit.create({
      data: {
        userId,
        type: 'settings_change',
        action: 'Privacy settings updated',
        timestamp: new Date().toISOString(),
        device: request.headers.get('user-agent') || 'Unknown',
        location: 'Unknown', // In real app, would get from IP geolocation
        status: 'success'
      }
    });

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    logger.error('Error updating privacy settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateSecurityScore(settings: any): number {
  if (!settings) return 0;
  
  let score = 0;
  if (settings.dataEncryption) score += 20;
  if (settings.twoFactorAuth) score += 25;
  if (settings.biometricLock) score += 20;
  if (settings.autoLock) score += 15;
  if (settings.screenshotProtection) score += 10;
  if (settings.dataRetention <= 90) score += 10;
  
  return Math.min(score, 100);
}