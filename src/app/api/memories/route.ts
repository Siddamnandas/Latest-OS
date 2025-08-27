import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Validation schemas
const createMemorySchema = z.object({
  type: z.enum(['text', 'audio', 'video', 'image']),
  content: z.string().min(1),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sentiment: z.enum(['positive', 'neutral', 'negative']).default('positive'),
  partners: z.array(z.string()).default([]),
  is_private: z.boolean().default(false),
  memory_type: z.string().optional(),
  couple_id: z.string().optional()
});

const getMemoriesSchema = z.object({
  couple_id: z.string().optional(),
  type: z.enum(['text', 'audio', 'video', 'image']).optional(),
  memory_type: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
  search: z.string().optional(),
  tags: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = getMemoriesSchema.parse(queryParams);
    
    // Build where clause
    const where: any = {};
    
    // If couple_id is provided, use it; otherwise find user's couple
    if (validatedQuery.couple_id) {
      where.couple_id = validatedQuery.couple_id;
    } else {
      // Find user's couple
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { couple: true }
      });
      
      if (!user?.couple) {
        return NextResponse.json({ error: 'User is not part of a couple' }, { status: 400 });
      }
      
      where.couple_id = user.couple.id;
    }
    
    if (validatedQuery.type) {
      where.type = validatedQuery.type;
    }
    
    if (validatedQuery.memory_type) {
      where.memory_type = validatedQuery.memory_type;
    }
    
    if (validatedQuery.search) {
      where.OR = [
        { title: { contains: validatedQuery.search, mode: 'insensitive' } },
        { description: { contains: validatedQuery.search, mode: 'insensitive' } },
        { content: { contains: validatedQuery.search, mode: 'insensitive' } }
      ];
    }
    
    if (validatedQuery.tags) {
      const tags = validatedQuery.tags.split(',');
      where.tags = {
        contains: tags[0] // Basic tag filtering for SQLite
      };
    }

    const memories = await db.memory.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: validatedQuery.limit || 50,
      skip: validatedQuery.offset || 0,
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

    // Parse JSON fields for response
    const formattedMemories = memories.map(memory => ({
      ...memory,
      tags: JSON.parse(memory.tags || '[]'),
      partners: JSON.parse(memory.partners || '[]')
    }));

    return NextResponse.json({
      success: true,
      data: formattedMemories,
      total: formattedMemories.length
    });

  } catch (error) {
    console.error('Error fetching memories:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid query parameters', 
        details: error.issues 
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Extract form data
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || undefined;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const sentiment = formData.get('sentiment') as string || 'positive';
    const partners = JSON.parse(formData.get('partners') as string || '[]');
    const isPrivate = formData.get('is_private') === 'true';
    const memoryType = formData.get('memory_type') as string || undefined;
    const coupleId = formData.get('couple_id') as string || undefined;
    const file = formData.get('file') as File | null;
    const textContent = formData.get('content') as string || '';

    // Find user's couple if couple_id not provided
    let targetCoupleId = coupleId;
    if (!targetCoupleId) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { couple: true }
      });
      
      if (!user?.couple) {
        return NextResponse.json({ error: 'User is not part of a couple' }, { status: 400 });
      }
      
      targetCoupleId = user.couple.id;
    }

    let content = textContent;
    
    // Handle file upload for media types
    if (file && ['audio', 'video', 'image'].includes(type)) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'memories');
      
      // Create upload directory if it doesn't exist
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${targetCoupleId}_${timestamp}.${fileExtension}`;
      const filePath = join(uploadDir, filename);
      
      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      content = `/uploads/memories/${filename}`;
    }

    // Validate the data
    const validatedData = createMemorySchema.parse({
      type,
      content,
      title,
      description,
      tags,
      sentiment,
      partners,
      is_private: isPrivate,
      memory_type: memoryType,
      couple_id: targetCoupleId
    });

    // Create memory in database
    const memory = await db.memory.create({
      data: {
        couple_id: targetCoupleId,
        type: validatedData.type,
        content: validatedData.content,
        title: validatedData.title,
        description: validatedData.description,
        tags: JSON.stringify(validatedData.tags),
        sentiment: validatedData.sentiment,
        partners: JSON.stringify(validatedData.partners),
        is_private: validatedData.is_private,
        memory_type: validatedData.memory_type
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
      ...memory,
      tags: JSON.parse(memory.tags || '[]'),
      partners: JSON.parse(memory.partners || '[]')
    };

    return NextResponse.json({
      success: true,
      data: formattedMemory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating memory:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: error.issues 
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
