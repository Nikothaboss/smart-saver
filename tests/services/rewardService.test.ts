import { describe, it, expect } from "vitest";
import {
  createReward,
  deleteRewardById,
  getRewardsByUserId,
} from "@/lib/services/rewardService";
import { testUserId } from "../utils";

const userId = testUserId; // Replace with a valid user ID

describe("rewardService", () => {
  it("should create a reward for a user", async () => {
    const reward = await createReward({
      title: "First Transaction Badge",
      unlocked: true,
      userId,
    });

    expect(reward).toBeDefined();
    expect(reward.title).toBe("First Transaction Badge");
    expect(reward.userId).toBe(userId);
    expect(reward.unlocked).toBe(true);
  });

  it("should return rewards for a user", async () => {
    const rewards = await getRewardsByUserId(userId);
    expect(Array.isArray(rewards)).toBe(true);
  });

  it("should delete a reward", async () => {
    const reward = await createReward({
      title: "Delete Me",
      unlocked: false,
      userId,
    });

    const deleted = await deleteRewardById(reward.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(reward.id);
  });
});
