import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const completeTaskSchema = z.object({
  task_id: z.string().cuid()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id } = completeTaskSchema.parse(body);

    // Find the task
    const task = await db.task.findUnique({
      where: { id: task_id },
      include: { couple: true }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Task already completed' },
        { status: 400 }
      );
    }

    // Complete the task
    const updatedTask = await db.task.update({
      where: { id: task_id },
      data: {
        status: 'COMPLETED',
        completed_at: new Date()
      }
    });

    // Calculate coins based on task category and priority
    const calculateCoins = () => {
      const baseCoins = 20;
      const categoryMultiplier = {
        'romance': 1.5,
        'household': 1.0,
        'parenting': 1.3,
        'personal': 0.8,
        'health': 1.2
      };
      
      const multiplier = categoryMultiplier[task.category as keyof typeof categoryMultiplier] || 1.0;
      return Math.floor(baseCoins * multiplier);
    };

    const coinsEarned = calculateCoins();

    // Award coins
    await db.rewardTransaction.create({
      data: {
        couple_id: task.couple_id,
        coins_earned: coinsEarned,
        coins_spent: 0,
        activity: `Task completed: ${task.title}`
      }
    });

    // Check for completion streak bonus (if multiple tasks completed today)
    const today = new Date().toISOString().split('T')[0];
    const todaysCompletedTasks = await db.task.count({
      where: {
        couple_id: task.couple_id,
        status: 'COMPLETED',
        completed_at: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    let bonusCoins = 0;
    let streakMessage = '';

    // Award streak bonus for multiple completions
    if (todaysCompletedTasks >= 3) {
      bonusCoins = 50; // Productivity streak bonus
      streakMessage = 'Productivity streak! 3+ tasks completed today! 🚀';
      
      await db.rewardTransaction.create({
        data: {
          couple_id: task.couple_id,
          coins_earned: bonusCoins,
          coins_spent: 0,
          activity: 'Daily productivity streak bonus'
        }
      });
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      rewards: {
        coins_earned: coinsEarned + bonusCoins,
        base_coins: coinsEarned,
        bonus_coins: bonusCoins,
        streak_bonus: bonusCoins > 0,
        tasks_completed_today: todaysCompletedTasks
      },
      message: streakMessage || `Task completed! Earned ${coinsEarned} Lakshmi Coins! 🪙`
    });

  } catch (error) {
    console.error('Error completing task:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}

// Mark task as incomplete (undo completion)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id } = completeTaskSchema.parse(body);

    const task = await db.task.findUnique({
      where: { id: task_id }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Task is not completed' },
        { status: 400 }
      );
    }

    // Mark as incomplete
    const updatedTask = await db.task.update({
      where: { id: task_id },
      data: {
        status: 'PENDING',
        completed_at: null
      }
    });

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: 'Task marked as incomplete'
    });

  } catch (error) {
    console.error('Error uncompleting task:', error);
    return NextResponse.json(
      { error: 'Failed to mark task as incomplete' },
      { status: 500 }
    );
  }
}