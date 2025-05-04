import { describe, it, expect } from "vitest";
import { DELETE, PATCH } from "@/app/api/goals/[id]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("PATCH /api/goals/:id", () => {
  it("should update an existing goal", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const goal = await prisma.goal.create({
      data: {
        title: "Initial Goal",
        targetAmount: 5000,
        currentAmount: 1000,
        userId: user.id,
      },
    });

    const req = new NextRequest(`http://localhost/api/goals/${goal.id}`, {
      method: "PATCH",
      body: JSON.stringify({ currentAmount: 2500 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: { id: goal.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(goal.id);
    expect(json.currentAmount).toBe(2500);
  });

  it("should return 500 for invalid goal ID", async () => {
    const req = new NextRequest("http://localhost/api/goals/invalid-id", {
      method: "PATCH",
      body: JSON.stringify({ currentAmount: 100 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PATCH(req, { params: { id: "invalid-id" } });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBeDefined();
  });
});

describe("DELETE /api/goals/:id", () => {
  it("should delete a goal", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const goal = await prisma.goal.create({
      data: {
        title: "To Be Deleted",
        targetAmount: 1000,
        userId: user.id,
      },
    });

    const req = new Request(`http://localhost/api/goals/${goal.id}`, {
      method: "DELETE",
    });

    const res = await DELETE(req, { params: { id: goal.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(goal.id);

    const found = await prisma.goal.findUnique({ where: { id: goal.id } });
    expect(found).toBeNull();
  });
});
