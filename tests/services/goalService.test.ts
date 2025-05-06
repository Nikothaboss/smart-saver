import { describe, it, expect } from "vitest";
import {
  createGoal,
  updateGoal,
  getGoalsByUserId,
  deleteGoalById,
} from "@/lib/services/goalService";
import db from "@/lib/db/db";

const prisma = db;

describe("goalService", async () => {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found — seed a user first.");
  const userId = user.id;
  let goalId: string;

  it("should create a goal for a user", async () => {
    const goal = await createGoal({
      title: "Test Goal",
      targetAmount: 10000,
      currentAmount: 1000,
      userId,
    });

    expect(goal).toBeDefined();
    expect(goal.userId).toBe(userId);
    expect(goal.title).toBe("Test Goal");

    goalId = goal.id;
  });

  it("should update a goal", async () => {
    const updated = await updateGoal(goalId, {
      currentAmount: 2000,
    });

    expect(updated).toBeDefined();
    expect(updated.currentAmount).toBe(2000);
  });

  it("should return goals for a user", async () => {
    const goals = await getGoalsByUserId(userId);
    expect(Array.isArray(goals)).toBe(true);
  });
  it("should delete a goal", async () => {
    const goal = await createGoal({
      title: "To Be Deleted",
      targetAmount: 1000,
      userId,
    });

    const deleted = await deleteGoalById(goal.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(goal.id);
  });
});
