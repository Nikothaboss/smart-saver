import { getUserTransactions } from "@/lib/services/userService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const transactions = await getUserTransactions(params.id);
  return NextResponse.json(transactions);
}
