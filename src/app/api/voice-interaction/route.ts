import { registry } from "@/lib/openapi";
registry.registerPath({ method: "get", path: "/api/voice-interaction", responses: { 200: { description: "Success" } } });
registry.registerPath({ method: "post", path: "/api/voice-interaction", responses: { 200: { description: "Success" } } });

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
  if (!session?.user?.id || !session.user.couple?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await db.voiceSession.findMany({
      where: { couple_id: session.user.couple.id },
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
  if (!session?.user?.id || !session.user.couple?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);

    const voiceSession = await db.voiceSession.create({
      data: {
        couple_id: session.user.couple.id,
        user_id: session.user.id,
        transcript: parsed.transcript ?? null,
        commands: parsed.commands,
        duration: parsed.duration,
        sentiment: parsed.sentiment ?? null,
        emotions: parsed.emotions ?? null,
        session_data: parsed.sessionData ?? null,
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
