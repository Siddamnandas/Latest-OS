import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Profile validation schema
const profileSchema = z.object({
  partner_a_name: z.string().min(1, 'Partner A name is required'),
  partner_b_name: z.string().min(1, 'Partner B name is required'),
  anniversary_date: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.enum(['north-india', 'south-india', 'east-india', 'west-india', 'central-india']),
  language: z.string().min(1, 'Language is required'),
});

export async function GET() {
  try {
    // For now, return mock data. In a real app, you'd get the couple ID from session/auth
    const mockCoupleData = {
      id: '1',
      partner_a_name: 'Arjun',
      partner_b_name: 'Priya',
      anniversary_date: null,
      city: 'Mumbai',
      region: 'west-india',
      language: 'hindi',
      profile_image: null,
      premium_until: null,
    };

    return NextResponse.json(mockCoupleData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validationResult = profileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const profileData = validationResult.data;

    // In a real app, you'd get the couple ID from session/auth
    const coupleId = '1'; // Mock couple ID

    // Update the couple profile in database
    const updatedCouple = await prisma.couple.update({
      where: { id: coupleId },
      data: {
        partner_a_name: profileData.partner_a_name,
        partner_b_name: profileData.partner_b_name,
        anniversary_date: profileData.anniversary_date ? new Date(profileData.anniversary_date) : null,
        city: profileData.city,
        region: profileData.region,
        language: profileData.language,
        updated_at: new Date(),
      },
    });

    // Transform the response to match what the frontend expects
    const responseData = {
      id: updatedCouple.id,
      partner_a_name: updatedCouple.partner_a_name,
      partner_b_name: updatedCouple.partner_b_name,
      anniversary_date: updatedCouple.anniversary_date?.toISOString() || null,
      city: updatedCouple.city,
      region: updatedCouple.region,
      language: updatedCouple.language,
      profile_image: null, // We'll add this later
      premium_until: updatedCouple.premium_until?.toISOString() || null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating profile:', error);

    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
