import { describe, it, expect } from "vitest";
import { DELETE } from "@/app/api/transactions/[id]/route";
import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

describe("DELETE /api/transactions/:id", () => {
  it("should delete a transaction", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });
    if (!account) throw new Error("No account found for test user");

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(),
        description: "Delete Me",
        amount: -42,
        currency: Currency.NOK,
        accountId: account.id,
      },
    });

    const req = new Request(
      `http://localhost/api/transactions/${transaction.id}`,
      {
        method: "DELETE",
      }
    );

    const res = await DELETE(req, { params: { id: transaction.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(transaction.id);

    const check = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    });
    expect(check).toBeNull();
  });
});
