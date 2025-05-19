import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";

const prisma = new PrismaClient();

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET() {
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(keys);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = createKeySchema.parse(body);
    const key = `ak_${crypto.randomBytes(32).toString("hex")}`;
    const apiKey = await prisma.apiKey.create({
      data: { name, key },
    });
    return NextResponse.json(apiKey);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 