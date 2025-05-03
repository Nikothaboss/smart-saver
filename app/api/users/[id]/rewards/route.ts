import { getRewardsByUserId } from "@/lib/services/rewardService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const rewards = await getRewardsByUserId(params.id);
    return NextResponse.json(rewards);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}
