import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, syncData } = await request.json();

    if (!userId || !syncData) {
      return NextResponse.json({ error: 'User ID and sync data required' }, { status: 400 });
    }

    const { actions, deviceInfo } = syncData;

    // Process sync actions
    const results = await Promise.all(
      actions.map(async (action: any) => {
        try {
          switch (action.type) {
            case 'conversation':
              return await syncConversation(action, userId);
            case 'activity':
              return await syncActivity(action, userId);
            case 'milestone':
              return await syncMilestone(action, userId);
            case 'photo':
              return await syncPhoto(action, userId);
            case 'settings':
              return await syncSettings(action, userId);
            default:
              return { id: action.id, status: 'error', message: 'Unknown action type' };
          }
        } catch (error) {
          return { id: action.id, status: 'error', message: (error instanceof Error ? error.message : String(error)) };
        }
      })
    );

    // Placeholder server-changes (DB models not present)
    const serverChanges: any[] = [];
    return NextResponse.json({ results, serverChanges, syncTimestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error during sync:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get sync status
    const syncStatus = await getSyncStatus(userId);

    // Get offline data summary
    const offlineData = await getOfflineDataSummary(userId);

    // No DB-backed logs available in current schema
    return NextResponse.json({ syncStatus, offlineData, syncLogs: [] });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function syncConversation(action: any, userId: string) {
  return { id: action.id, status: 'success', serverId: action.serverId || `conv_${Date.now()}` };
}

async function syncActivity(action: any, userId: string) {
  return { id: action.id, status: 'success', serverId: action.serverId || `act_${Date.now()}` };
}

async function syncMilestone(action: any, userId: string) {
  return { id: action.id, status: 'success', serverId: action.serverId || `ms_${Date.now()}` };
}

async function syncPhoto(action: any, userId: string) {
  return { id: action.id, status: 'success', serverId: action.serverId || `photo_${Date.now()}` };
}

async function syncSettings(action: any, userId: string) {
  return { id: action.id, status: 'success' };
}

async function getServerChanges(userId: string, lastSync: string) {
  return { conversations: [], activities: [], milestones: [] };
}

async function getSyncStatus(userId: string) {
  return { lastSync: null, pendingActions: 0, isOnline: true };
}

async function getOfflineDataSummary(userId: string) {
  return { conversations: 0, activities: 0, milestones: 0, photos: 0, totalSize: 0 };
}
