import { createGoal } from "@/lib/services/goalService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const goal = await createGoal(data);
    return NextResponse.json(goal);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
