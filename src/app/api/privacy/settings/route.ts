import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getSettings as getSettingsStore, setSettings as setSettingsStore, getAudits, addAudit } from '@/lib/privacy/settingsStore';

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

    // Get user privacy settings and audit log from in-memory store
    const privacySettings = getSettingsStore(userId);
    const securityAudits = getAudits(userId).slice(0, 50);

    // Calculate security score
    const securityScore = calculateSecurityScore(privacySettings);

    return NextResponse.json({
      settings: privacySettings,
      securityAudits,
      securityScore
    });
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
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

    // Update privacy settings in in-memory store
    setSettingsStore(userId, settings);
    const updatedSettings = getSettingsStore(userId);

    // Log the settings change
    addAudit({
      userId,
      type: 'settings_change',
      action: 'Privacy settings updated',
      timestamp: new Date().toISOString(),
      device: request.headers.get('user-agent') || 'Unknown',
      location: 'Unknown',
      status: 'success'
    });

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
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
