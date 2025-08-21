import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Rituals API endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Ritual created' });
}