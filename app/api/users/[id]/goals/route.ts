import { getUserGoals } from "@/lib/services/userService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const goals = await getUserGoals(params.id);
  return NextResponse.json(goals);
}
