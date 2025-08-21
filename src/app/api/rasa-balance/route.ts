import { registry } from "@/lib/openapi";
registry.registerPath({ method: "get", path: "/api/rasa-balance", responses: { 200: { description: "Success" } } });
registry.registerPath({ method: "post", path: "/api/rasa-balance", responses: { 200: { description: "Success" } } });

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API endpoint" });
}

export async function POST() {
  return NextResponse.json({ message: "Operation completed" });
}
