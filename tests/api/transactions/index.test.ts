import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/transactions/route";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("POST /api/transactions", () => {
  it("should create a transaction for an account", async () => {
    const account = await prisma.account.findFirst();
    if (!account) throw new Error("No account found — seed an account first.");

    const payload = {
      date: new Date().toISOString(),
      description: "API Test Transaction",
      amount: -99.99,
      currency: Currency.NOK,
      accountId: account.id,
    };

    const req = new NextRequest("http://localhost/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.accountId).toBe(account.id);
    expect(json.description).toBe("API Test Transaction");
  });

  it("should return 500 for invalid transaction payload", async () => {
    const req = new NextRequest("http://localhost/api/transactions", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBeDefined();
  });
});
