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
          return { id: action.id, status: 'error', message: error.message };
        }
      })
    );

    // Log sync activity
    await db.syncLog.create({
      data: {
        userId,
        deviceInfo: JSON.stringify(deviceInfo),
        actionsCount: actions.length,
        successCount: results.filter(r => r.status === 'success').length,
        timestamp: new Date().toISOString()
      }
    });

    // Get any server-side changes for the client
    const serverChanges = await getServerChanges(userId, syncData.lastSyncTimestamp);

    return NextResponse.json({
      results,
      serverChanges,
      syncTimestamp: new Date().toISOString()
    });
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

    // Get recent sync logs
    const syncLogs = await db.syncLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return NextResponse.json({
      syncStatus,
      offlineData,
      syncLogs
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function syncConversation(action: any, userId: string) {
  if (action.action === 'create') {
    const conversation = await db.conversation.create({
      data: {
        userId,
        partnerId: action.partnerId,
        content: action.content,
        timestamp: action.timestamp,
        type: action.type,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success', serverId: conversation.id };
  } else if (action.action === 'update') {
    await db.conversation.update({
      where: { id: action.serverId },
      data: {
        content: action.content,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success' };
  } else if (action.action === 'delete') {
    await db.conversation.delete({
      where: { id: action.serverId }
    });
    return { id: action.id, status: 'success' };
  }
  
  return { id: action.id, status: 'error', message: 'Invalid conversation action' };
}

async function syncActivity(action: any, userId: string) {
  if (action.action === 'create') {
    const activity = await db.activity.create({
      data: {
        userId,
        title: action.title,
        description: action.description,
        type: action.type,
        timestamp: action.timestamp,
        completed: action.completed,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success', serverId: activity.id };
  } else if (action.action === 'update') {
    await db.activity.update({
      where: { id: action.serverId },
      data: {
        title: action.title,
        description: action.description,
        completed: action.completed,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success' };
  } else if (action.action === 'delete') {
    await db.activity.delete({
      where: { id: action.serverId }
    });
    return { id: action.id, status: 'success' };
  }
  
  return { id: action.id, status: 'error', message: 'Invalid activity action' };
}

async function syncMilestone(action: any, userId: string) {
  if (action.action === 'create') {
    const milestone = await db.milestone.create({
      data: {
        userId,
        title: action.title,
        description: action.description,
        category: action.category,
        dateAchieved: action.dateAchieved,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success', serverId: milestone.id };
  } else if (action.action === 'update') {
    await db.milestone.update({
      where: { id: action.serverId },
      data: {
        title: action.title,
        description: action.description,
        dateAchieved: action.dateAchieved,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success' };
  } else if (action.action === 'delete') {
    await db.milestone.delete({
      where: { id: action.serverId }
    });
    return { id: action.id, status: 'success' };
  }
  
  return { id: action.id, status: 'error', message: 'Invalid milestone action' };
}

async function syncPhoto(action: any, userId: string) {
  // Photo sync would involve file upload logic
  // This is a simplified version
  if (action.action === 'create') {
    const photo = await db.photo.create({
      data: {
        userId,
        url: action.url,
        caption: action.caption,
        timestamp: action.timestamp,
        metadata: action.metadata || {}
      }
    });
    return { id: action.id, status: 'success', serverId: photo.id };
  }
  
  return { id: action.id, status: 'error', message: 'Invalid photo action' };
}

async function syncSettings(action: any, userId: string) {
  if (action.action === 'update') {
    await db.userSetting.upsert({
      where: { userId },
      update: action.settings,
      create: {
        userId,
        ...action.settings
      }
    });
    return { id: action.id, status: 'success' };
  }
  
  return { id: action.id, status: 'error', message: 'Invalid settings action' };
}

async function getServerChanges(userId: string, lastSync: string) {
  const changes = [];
  
  // Get new conversations
  const newConversations = await db.conversation.findMany({
    where: {
      OR: [
        { userId, timestamp: { gt: lastSync } },
        { partnerId: userId, timestamp: { gt: lastSync } }
      ]
    }
  });
  
  // Get updated activities
  const updatedActivities = await db.activity.findMany({
    where: {
      userId,
      updatedAt: { gt: lastSync }
    }
  });
  
  // Get new milestones
  const newMilestones = await db.milestone.findMany({
    where: {
      userId,
      createdAt: { gt: lastSync }
    }
  });
  
  return {
    conversations: newConversations,
    activities: updatedActivities,
    milestones: newMilestones
  };
}

async function getSyncStatus(userId: string) {
  const lastSync = await db.syncLog.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  });
  
  const pendingActions = await db.syncQueue.findMany({
    where: { userId }
  });
  
  return {
    lastSync: lastSync?.timestamp || null,
    pendingActions: pendingActions.length,
    isOnline: true // This would be determined by actual connectivity status
  };
}

async function getOfflineDataSummary(userId: string) {
  const conversations = await db.conversation.count({
    where: { userId }
  });
  
  const activities = await db.activity.count({
    where: { userId }
  });
  
  const milestones = await db.milestone.count({
    where: { userId }
  });
  
  const photos = await db.photo.count({
    where: { userId }
  });
  
  // Calculate estimated storage size
  const estimatedSize = (conversations * 0.5) + (activities * 0.2) + (milestones * 0.1) + (photos * 2);
  
  return {
    conversations,
    activities,
    milestones,
    photos,
    totalSize: Math.round(estimatedSize * 100) / 100
  };
}