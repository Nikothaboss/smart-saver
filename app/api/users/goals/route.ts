import { getGoalsByUserId } from "@/lib/services/goalService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const goals = await getGoalsByUserId(params.id);
  return NextResponse.json(goals);
}
