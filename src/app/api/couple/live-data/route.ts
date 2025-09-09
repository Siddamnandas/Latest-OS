import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if in development mode
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
      // Return demo data for development
      return NextResponse.json({
        couple: {
          id: 'demo',
          partner_a: 'Arjun',
          partner_b: 'Priya',
          city: 'Mumbai',
          anniversary_date: '2022-02-14',
          st_coins: 250,
        },
        stats: {
          streak: 7,
          coins: 250,
          relationshipLevel: 'Developing',
          relationshipScore: 45,
          totalSyncs: 5,
          completedTasks: 3,
          totalTasks: 5,
          totalMemories: 4,
          taskCompletionRate: 60,
          lastSync: null,
        },
        activity: {
          recentSyncs: [],
          activeTasks: [],
          recentMemories: [],
        },
        insights: [],
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Production: require proper authentication
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching live couple data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (!isDevelopment) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Demo: Sync entry would be created',
      data: body,
    });

  } catch (error) {
    console.error('Error creating sync entry:', error);
    return NextResponse.json(
      { error: 'Failed to create sync entry', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
