import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/rewards/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("POST /api/rewards", () => {
  it("should create a reward for a user", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found — seed a user first.");

    const payload = {
      title: "First 1k Saved",
      unlocked: true,
      userId: user.id,
    };

    const req = new NextRequest("http://localhost/api/rewards", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.title).toBe(payload.title);
    expect(json.userId).toBe(payload.userId);
    expect(json.unlocked).toBe(true);
  });

  it("should return 500 for missing fields", async () => {
    const req = new NextRequest("http://localhost/api/rewards", {
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
