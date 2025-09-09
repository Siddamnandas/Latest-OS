import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/memories - Fetch memories for the user's couple
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the couple this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user?.couple) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const type = url.searchParams.get('type');

    // Build where clause
    const where: any = {
      couple_id: user.couple.id,
    };

    if (type) {
      where.type = type;
    }

    // Fetch memories with pagination and sorting
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          type: true,
          content: true,
          title: true,
          description: true,
          date: true,
          tags: true,
          sentiment: true,
          partners: true,
          is_private: true,
          created_at: true,
        },
      }),
      prisma.memory.count({ where }),
    ]);

    // Process tags (stored as JSON string in SQLite)
    const processedMemories = memories.map(memory => ({
      ...memory,
      tags: JSON.parse(memory.tags),
      partners: JSON.parse(memory.partners),
    }));

    return NextResponse.json({
      memories: processedMemories,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });

  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the couple this user belongs to
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user?.couple) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['type', 'title'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate memory type
    const validTypes = ['text', 'audio', 'video', 'image'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid memory type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Process content based on type
    let content = body.content;
    if (body.type !== 'text' && !body.content) {
      if (body.mediaUrl) {
        content = body.mediaUrl;
      } else {
        return NextResponse.json(
          { error: 'Content or mediaUrl is required for non-text memories' },
          { status: 400 }
        );
      }
    }

    // Create the memory
    const memory = await prisma.memory.create({
      data: {
        couple_id: user.couple.id,
        type: body.type,
        content: content,
        title: body.title,
        description: body.description || '',
        date: body.date ? new Date(body.date) : new Date(),
        tags: JSON.stringify(body.tags || []),
        sentiment: body.sentiment || 'positive',
        partners: JSON.stringify(body.partners || ['current_user']),
        is_private: body.is_private || false,
      },
    });

    // Award points based on memory creation
    // This would typically trigger gamification events

    return NextResponse.json(
      {
        memory,
        success: true,
        message: 'Memory created successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json(
      { error: 'Failed to create memory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/memories - Batch update memories
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user?.couple) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const body = await request.json();

    if (!body.memories || !Array.isArray(body.memories)) {
      return NextResponse.json(
        { error: 'memories array is required' },
        { status: 400 }
      );
    }

    const updates: any[] = [];
    const errors: any[] = [];

    for (const update of body.memories) {
      if (!update.id) {
        errors.push({ memory: null, error: 'Memory ID is required' });
        continue;
      }

      try {
        const memory = await prisma.memory.findFirst({
          where: {
            id: update.id,
            couple_id: user.couple.id,
          },
        });

        if (!memory) {
          errors.push({ memory: update.id, error: 'Memory not found or access denied' });
          continue;
        }

        const updatedMemory = await prisma.memory.update({
          where: { id: update.id },
          data: {
            ...(update.title !== undefined && { title: update.title }),
            ...(update.description !== undefined && { description: update.description }),
            ...(update.tags !== undefined && { tags: JSON.stringify(update.tags) }),
            ...(update.sentiment !== undefined && { sentiment: update.sentiment }),
            ...(update.is_private !== undefined && { is_private: update.is_private }),
            updated_at: new Date(),
          },
        });

        updates.push(updatedMemory);

      } catch (error) {
        errors.push({
          memory: update.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      updated: updates.length,
      errors: errors.length,
      memories: updates,
      errorDetails: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Error batch updating memories:', error);
    return NextResponse.json(
      { error: 'Failed to update memories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/memories - Batch delete memories
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true },
    });

    if (!user?.couple) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const url = new URL(request.url);
    const ids = url.searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: 'Memory IDs are required (ids parameter)' },
        { status: 400 }
      );
    }

    const memoryIds = ids.split(',');

    // Delete memories (only those belonging to this couple)
    const result = await prisma.memory.deleteMany({
      where: {
        id: { in: memoryIds },
        couple_id: user.couple.id,
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `Successfully deleted ${result.count} memories`,
    });

  } catch (error) {
    console.error('Error deleting memories:', error);
    return NextResponse.json(
      { error: 'Failed to delete memories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
