import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/accounts/route";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("POST /api/accounts", () => {
  it("should create a new account", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found — seed a user first.");

    const payload = {
      accountNumber: "****5678",
      accountType: "Savings",
      balance: 5000,
      currency: Currency.NOK,
      userId: user.id,
    };

    const req = new NextRequest("http://localhost/api/accounts", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.accountNumber).toBe(payload.accountNumber);
    expect(json.userId).toBe(payload.userId);
  });

  it("should return 500 for missing fields", async () => {
    const req = new NextRequest("http://localhost/api/accounts", {
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
