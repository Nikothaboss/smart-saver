import {
  deleteBankAccountById,
  getBankAccountById,
} from "@/lib/services/bankAccountService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const account = await getBankAccountById(params.id);
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteBankAccountById(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
