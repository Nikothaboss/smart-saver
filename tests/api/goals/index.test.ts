import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/goals/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("POST /api/goals", () => {
  it("should create a goal for a user", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found — seed a user first.");

    const payload = {
      title: "Save for Vacation",
      targetAmount: 15000,
      currentAmount: 3000,
      userId: user.id,
    };

    const req = new NextRequest("http://localhost/api/goals", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.title).toBe(payload.title);
    expect(json.userId).toBe(payload.userId);
  });

  it("should return 500 for missing fields", async () => {
    const req = new NextRequest("http://localhost/api/goals", {
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
