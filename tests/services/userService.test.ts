import {
  getUserById,
  getUserGoals,
  getUserRewards,
  getUserTransactions,
} from "@/lib/services/userService";
import { describe, it, expect } from "vitest";
import db from "@/lib/db/db";

const prisma = db;

describe("userService", async () => {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found — seed a user first.");
  const userId = user.id;
  it("should return user with related data", async () => {
    const user = await getUserById(userId);
    expect(user).toBeDefined();
    expect(user?.id).toBe(userId);
    expect(Array.isArray(user?.accounts)).toBe(true);
    expect(Array.isArray(user?.goals)).toBe(true);
    expect(Array.isArray(user?.rewards)).toBe(true);
  });

  it("should return user goals", async () => {
    const goals = await getUserGoals(userId);
    expect(Array.isArray(goals)).toBe(true);
  });

  it("should return user rewards", async () => {
    const rewards = await getUserRewards(userId);
    expect(Array.isArray(rewards)).toBe(true);
  });

  it("should return user transactions", async () => {
    const transactions = await getUserTransactions(userId);
    expect(Array.isArray(transactions)).toBe(true);
    if (transactions.length > 0) {
      expect(transactions[0]).toHaveProperty("account");
    }
  });
});
