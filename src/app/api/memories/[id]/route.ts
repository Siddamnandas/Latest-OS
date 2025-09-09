import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/memories/[id] - Fetch a specific memory
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params;

    // Fetch the specific memory
    const memory = await prisma.memory.findFirst({
      where: {
        id,
        couple_id: user.couple.id, // Ensure user can only access their own couple's memories
      },
      select: {
        id: true,
        couple_id: true,
        type: true,
        content: true,
        title: true,
        description: true,
        date: true,
        tags: true,
        sentiment: true,
        partners: true,
        is_private: true,
        memory_type: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Process JSON fields
    const processedMemory = {
      ...memory,
      tags: JSON.parse(memory.tags),
      partners: JSON.parse(memory.partners),
    };

    return NextResponse.json({ memory: processedMemory });

  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/memories/[id] - Update a specific memory
export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params;
    const body = await request.json();

    // Verify memory ownership
    const existingMemory = await prisma.memory.findFirst({
      where: {
        id,
        couple_id: user.couple.id,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found or access denied' }, { status: 404 });
    }

    // Build update object
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.sentiment !== undefined) updateData.sentiment = body.sentiment;
    if (body.partners !== undefined) updateData.partners = JSON.stringify(body.partners);
    if (body.is_private !== undefined) updateData.is_private = body.is_private;
    if (body.memory_type !== undefined) updateData.memory_type = body.memory_type;

    // Only update content and type if the memory is being transformed
    if (body.type !== undefined) updateData.type = body.type;
    if (body.content !== undefined) updateData.content = body.content;

    // Set updated timestamp
    updateData.updated_at = new Date();

    // Update the memory
    const updatedMemory = await prisma.memory.update({
      where: { id },
      data: updateData,
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
        memory_type: true,
        updated_at: true,
      },
    });

    // Process JSON fields for response
    const processedMemory = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags),
      partners: JSON.parse(updatedMemory.partners),
    };

    return NextResponse.json({
      memory: processedMemory,
      success: true,
      message: 'Memory updated successfully',
    });

  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json(
      { error: 'Failed to update memory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/memories/[id] - Delete a specific memory
export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params;

    // Verify memory ownership before deletion
    const memory = await prisma.memory.findFirst({
      where: {
        id,
        couple_id: user.couple.id,
      },
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found or access denied' }, { status: 404 });
    }

    // Delete the memory
    await prisma.memory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Memory deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { error: 'Failed to delete memory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
