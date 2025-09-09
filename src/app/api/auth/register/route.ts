import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, partnerRole, coupleData } = await request.json();

    // Validate required fields
    if (!email || !password || !name || !partnerRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create couple if coupleData is provided
    let couple;
    if (coupleData) {
      couple = await db.couple.create({
        data: {
          partner_a_name: partnerRole === 'partner_a' ? name : coupleData.partnerName,
          partner_b_name: partnerRole === 'partner_b' ? name : coupleData.partnerName,
          anniversary_date: coupleData.anniversaryDate ? new Date(coupleData.anniversaryDate) : null,
          city: coupleData.city || 'Hyderabad',
          region: coupleData.region || 'north-india',
          language: coupleData.language || 'hindi',
          encryption_key: Math.random().toString(36).substring(7),
        }
      });
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        couple_id: couple?.id || ''
      }
    });

    // Initialize Rasa balance if couple was created
    if (couple) {
      await db.rasaBalance.create({
        data: {
          couple_id: couple.id,
          play_percentage: 33.33,
          duty_percentage: 33.33,
          balance_percentage: 33.34
        }
      });
    }

    // Remove password from response
    const userWithoutPassword = (({ password, ...rest }) => rest)(user as any);

    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      couple
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
