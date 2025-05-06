import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db/db";

import type { PrismaClient, User } from "@prisma/client";
import type { DeepMockProxy } from "vitest-mock-extended";

// Hoist-safe mocking
vi.mock("@/lib/auth", () => import("@/__mocks__/lib/auth"));
vi.mock("@/lib/db/db", () => import("@/__mocks__/lib/db/db"));

// Cast the mock correctly
const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

let POST: typeof import("@/app/api/goals/[id]/contribute/route").POST;

describe("POST /api/goals/[id]/contribute", () => {
  const mockUser: User = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
    password: null,
    image: null,
    emailVerified: null,
  };

  const mockGoal = {
    id: "goal-1",
    userId: mockUser.id,
    title: "Save for bike",
    currentAmount: 50,
    targetAmount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    POST = (await import("@/app/api/goals/[id]/contribute/route")).POST;
  });

  it("returns 401 if not authenticated", async () => {
    (auth as any).mockResolvedValue(null);

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 20 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 404 if user not found", async () => {
    (auth as any).mockResolvedValue({ user: { email: mockUser.email } });
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 10 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "User not found" });
  });

  it("returns 400 if amount is invalid", async () => {
    (auth as any).mockResolvedValue({ user: { email: mockUser.email } });
    mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 0 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid amount" });
  });

  it("returns 404 if goal not found", async () => {
    (auth as any).mockResolvedValue({ user: { email: mockUser.email } });
    mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockedPrisma.goal.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 10 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Goal not found" });
  });

  it("returns 403 if goal does not belong to user", async () => {
    (auth as any).mockResolvedValue({ user: { email: mockUser.email } });
    mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockedPrisma.goal.findUnique.mockResolvedValue({
      ...mockGoal,
      userId: "hacker",
    });

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 10 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("updates goal and creates reward if completed", async () => {
    (auth as any).mockResolvedValue({ user: { email: mockUser.email } });
    mockedPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockedPrisma.goal.findUnique.mockResolvedValue(mockGoal);
    mockedPrisma.goal.update.mockResolvedValue({
      ...mockGoal,
      currentAmount: 100,
    });
    mockedPrisma.reward.findFirst.mockResolvedValue(null);
    mockedPrisma.reward.create.mockResolvedValue({
      id: "reward-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      title: "",
      userId: "",
      unlocked: false,
    });

    const req = new Request("http://localhost/api/goals/goal-1/contribute", {
      method: "POST",
      body: JSON.stringify({ amount: 50 }),
    });

    const res = await POST(req, { params: { id: "goal-1" } });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result.currentAmount).toBe(100);
    expect(mockedPrisma.reward.create).toHaveBeenCalledWith({
      data: {
        title: "Completed Goal: Save for bike",
        unlocked: true,
        userId: mockUser.id,
      },
    });
  });
});
