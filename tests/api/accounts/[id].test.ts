import { describe, it, expect } from "vitest";
import { DELETE, GET } from "@/app/api/accounts/[id]/route";
import db from "@/lib/db/db";
import { Currency } from "@prisma/client";

const prisma = db;

describe("GET /api/accounts/:id", () => {
  it("should return the account with transactions", async () => {
    const account = await prisma.bankAccount.findFirst();
    if (!account) throw new Error("No account found — seed an account first.");
    const req = new Request(`http://localhost/api/accounts/${account?.id}`);
    const res = await GET(req, { params: { id: account?.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(account.id);
    expect(Array.isArray(json.transactions)).toBe(true);
  });

  it("should return 404 if the account does not exist", async () => {
    const req = new Request("http://localhost/api/accounts/non-existent-id");
    const res = await GET(req, { params: { id: "non-existent-id" } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBeDefined();
  });
});

describe("DELETE /api/accounts/:id", () => {
  it("should delete an account", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const account = await prisma.bankAccount.create({
      data: {
        accountNumber: "****DEL",
        accountType: "Temp",
        balance: 100,
        currency: Currency.NOK,
        userId: user.id,
      },
    });

    const req = new Request(`http://localhost/api/accounts/${account.id}`, {
      method: "DELETE",
    });

    const res = await DELETE(req, { params: { id: account.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(account.id);

    const check = await prisma.account.findUnique({
      where: { id: account.id },
    });
    expect(check).toBeNull();
  });
});
