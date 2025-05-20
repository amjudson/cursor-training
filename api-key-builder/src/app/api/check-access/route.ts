import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Here you would typically check if the user has a valid session
    // or if their API key is still valid
    // For this example, we'll just return success
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 