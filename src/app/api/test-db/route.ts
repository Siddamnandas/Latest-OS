import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('Current working directory:', process.cwd());
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test basic connection
    await db.$connect();
    console.log('Database connection successful');
    
    // Test query
    const coupleCount = await db.couple.count();
    console.log('Couple count:', coupleCount);
    
    // Test findFirst
    const couple = await db.couple.findFirst();
    console.log('First couple:', couple);
    
    await db.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      coupleCount,
      couple: couple ? {
        id: couple.id,
        names: `${couple.partner_a_name} & ${couple.partner_b_name}`
      } : null
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}