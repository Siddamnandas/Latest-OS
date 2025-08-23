import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/search';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  try {
    const hits = await search(q);
    return NextResponse.json({ hits });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
