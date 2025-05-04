import { deleteUserById, getUserById } from "@/lib/services/userService";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  return NextResponse.json(user);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteUserById(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
