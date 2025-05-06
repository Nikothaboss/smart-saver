import { createBankAccount } from "@/lib/services/bankAccountService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const account = await createBankAccount(data);
    return NextResponse.json(account);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
