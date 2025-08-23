import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  assigned_to: z.enum(['partner_a', 'partner_b', 'both']),
  category: z.string().min(1).max(50),
  due_at: z.string().datetime().optional()
});

export async function GET() {
  try {
    // Get the first couple's tasks (in a real app, this would be based on user authentication)
    const couple = await db.couple.findFirst();
    
    if (!couple) {
      return NextResponse.json([]);
    }

    const tasks = await db.task.findMany({
      where: {
        couple_id: couple.id,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 50, // Increased limit for better UX
    });

    return NextResponse.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Get or create demo couple
    let couple = await db.couple.findFirst();
    if (!couple) {
      couple = await db.couple.create({
        data: {
          partner_a_name: 'Arjun',
          partner_b_name: 'Priya', 
          anniversary_date: new Date('2022-02-14'),
          city: 'Mumbai',
          region: 'north-india',
          language: 'hindi',
          children: JSON.stringify([]),
          encryption_key: 'demo-key-12345678901234567890123456789012'
        }
      });
    }

    const task = await db.task.create({
      data: {
        couple_id: couple.id,
        title: validatedData.title,
        description: validatedData.description || '',
        assigned_to: validatedData.assigned_to,
        category: validatedData.category,
        status: 'PENDING',
        due_at: validatedData.due_at ? new Date(validatedData.due_at) : null,
        ai_reasoning: JSON.stringify({
          priority: 'medium',
          estimated_duration: 30,
          suggested_time: 'evening'
        })
      }
    });

    return NextResponse.json(task, { status: 201 });

  } catch (error) {
    logger.error('Error creating task:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}