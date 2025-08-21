import { registry } from "@/lib/openapi";
registry.registerPath({ method: "get", path: "/api/rewards", responses: { 200: { description: "Success" } } });
registry.registerPath({ method: "post", path: "/api/rewards", responses: { 200: { description: "Success" } } });

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  coinsEarned: z.number().int(),
  coinsSpent: z.number().int().optional(),
  activity: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.couple?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rewards = await db.rewardTransaction.findMany({
      where: { couple_id: session.user.couple.id },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ rewards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.couple?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);

    const reward = await db.rewardTransaction.create({
      data: {
        couple_id: session.user.couple.id,
        coins_earned: parsed.coinsEarned,
        coins_spent: parsed.coinsSpent ?? 0,
        activity: parsed.activity,
      },
    });

    return NextResponse.json({ reward }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Error creating reward:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
