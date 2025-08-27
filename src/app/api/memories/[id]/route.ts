import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { z } from 'zod';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Validation schema for updating memory
const updateMemorySchema = z.object({
  type: z.enum(['text', 'audio', 'video', 'image']).optional(),
  content: z.string().optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  partners: z.array(z.string()).optional(),
  is_private: z.boolean().optional(),
  memory_type: z.string().optional()
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find the memory
    const memory = await db.memory.findUnique({
      where: { id },
      include: {
        couple: {
          select: {
            id: true,
            partner_a_name: true,
            partner_b_name: true
          }
        }
      }
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Check if user has access to this memory
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true }
    });

    if (!user?.couple || user.couple.id !== memory.couple_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Format response
    const formattedMemory = {
      ...memory,
      tags: JSON.parse(memory.tags || '[]'),
      partners: JSON.parse(memory.partners || '[]')
    };

    return NextResponse.json({
      success: true,
      data: formattedMemory
    });

  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find the memory
    const existingMemory = await db.memory.findUnique({
      where: { id },
      include: { couple: true }
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Check if user has access to this memory
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true }
    });

    if (!user?.couple || user.couple.id !== existingMemory.couple_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const formData = await request.formData();
    
    // Extract form data
    const type = formData.get('type') as string || existingMemory.type;
    const title = formData.get('title') as string || existingMemory.title;
    const description = formData.get('description') as string || existingMemory.description;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : JSON.parse(existingMemory.tags || '[]');
    const sentiment = formData.get('sentiment') as string || existingMemory.sentiment;
    const partners = formData.get('partners') ? JSON.parse(formData.get('partners') as string) : JSON.parse(existingMemory.partners || '[]');
    const isPrivate = formData.get('is_private') !== null ? formData.get('is_private') === 'true' : existingMemory.is_private;
    const memoryType = formData.get('memory_type') as string || existingMemory.memory_type;
    const file = formData.get('file') as File | null;
    const textContent = formData.get('content') as string || existingMemory.content;

    let content = textContent;
    
    // Handle file upload for media types
    if (file && ['audio', 'video', 'image'].includes(type)) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'memories');
      
      // Create upload directory if it doesn't exist
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Delete old file if it exists and is in uploads directory
      if (existingMemory.content.startsWith('/uploads/memories/')) {
        const oldFilePath = join(process.cwd(), 'public', existingMemory.content);
        try {
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath);
          }
        } catch (error) {
          console.warn('Could not delete old file:', error);
        }
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${existingMemory.couple_id}_${timestamp}.${fileExtension}`;
      const filePath = join(uploadDir, filename);
      
      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      content = `/uploads/memories/${filename}`;
    }

    // Validate the data
    const validatedData = updateMemorySchema.parse({
      type,
      title,
      description,
      tags,
      sentiment,
      partners,
      is_private: isPrivate,
      memory_type: memoryType
    });

    // Update memory in database
    const updatedMemory = await db.memory.update({
      where: { id },
      data: {
        type: validatedData.type || existingMemory.type,
        content,
        title: validatedData.title || existingMemory.title,
        description: validatedData.description !== undefined ? validatedData.description : existingMemory.description,
        tags: JSON.stringify(validatedData.tags || JSON.parse(existingMemory.tags || '[]')),
        sentiment: validatedData.sentiment || existingMemory.sentiment,
        partners: JSON.stringify(validatedData.partners || JSON.parse(existingMemory.partners || '[]')),
        is_private: validatedData.is_private !== undefined ? validatedData.is_private : existingMemory.is_private,
        memory_type: validatedData.memory_type !== undefined ? validatedData.memory_type : existingMemory.memory_type,
        updated_at: new Date()
      },
      include: {
        couple: {
          select: {
            id: true,
            partner_a_name: true,
            partner_b_name: true
          }
        }
      }
    });

    // Format response
    const formattedMemory = {
      ...updatedMemory,
      tags: JSON.parse(updatedMemory.tags || '[]'),
      partners: JSON.parse(updatedMemory.partners || '[]')
    };

    return NextResponse.json({
      success: true,
      data: formattedMemory
    });

  } catch (error) {
    console.error('Error updating memory:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: error.issues 
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find the memory
    const memory = await db.memory.findUnique({
      where: { id },
      include: { couple: true }
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Check if user has access to this memory
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { couple: true }
    });

    if (!user?.couple || user.couple.id !== memory.couple_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete associated file if it exists in uploads directory
    if (memory.content.startsWith('/uploads/memories/')) {
      const filePath = join(process.cwd(), 'public', memory.content);
      try {
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Could not delete file:', error);
      }
    }

    // Delete memory from database
    await db.memory.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Memory deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}