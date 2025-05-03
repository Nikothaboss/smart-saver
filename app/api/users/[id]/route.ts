import { getUserById } from "@/lib/services/userService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  return NextResponse.json(user);
}
