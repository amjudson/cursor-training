import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { z } from 'zod';
import crypto from 'crypto';

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = createKeySchema.parse(body);

    // Generate a secure API key
    const key = `ak_${crypto.randomBytes(32).toString('hex')}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 