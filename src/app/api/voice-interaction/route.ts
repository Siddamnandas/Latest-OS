import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  transcript: z.string().optional(),
  commands: z.array(z.string()).default([]),
  duration: z.number().int(),
  sentiment: z.string().optional(),
  emotions: z.array(z.string()).optional(),
  sessionData: z.unknown().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { couple_id: true } });
    if (!user?.couple_id) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }
    const sessions = await db.voiceSession.findMany({
      where: { couple_id: user.couple_id },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching voice sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { couple_id: true } });
    if (!user?.couple_id) {
      return NextResponse.json({ error: 'User not associated with a couple' }, { status: 404 });
    }

    const voiceSession = await db.voiceSession.create({
      data: {
        couple_id: user.couple_id,
        title: parsed.transcript ? parsed.transcript.slice(0, 50) : 'Voice Session',
        duration: parsed.duration,
      },
    });

    return NextResponse.json({ voiceSession }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Error creating voice session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
