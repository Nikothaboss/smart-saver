import { createReward } from "@/lib/services/rewardService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const reward = await createReward(data);
    return NextResponse.json(reward);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create reward" },
      { status: 500 }
    );
  }
}
