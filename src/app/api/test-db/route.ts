import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.info('Testing database connection...');
    logger.info('Current working directory:', process.cwd());
    logger.info('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test basic connection
    await db.$connect();
    logger.info('Database connection successful');
    
    // Test query
    const coupleCount = await db.couple.count();
    logger.info('Couple count:', coupleCount);
    
    // Test findFirst
    const couple = await db.couple.findFirst();
    logger.info('First couple:', couple);
    
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
    logger.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}