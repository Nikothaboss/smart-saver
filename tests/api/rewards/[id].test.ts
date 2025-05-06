import { describe, it, expect } from "vitest";
import { DELETE } from "@/app/api/rewards/[id]/route";
import db from "@/lib/db/db";

const prisma = db;

describe("DELETE /api/rewards/:id", () => {
  it("should delete a reward", async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const reward = await prisma.reward.create({
      data: {
        title: "Delete This Reward",
        unlocked: false,
        userId: user.id,
      },
    });

    const req = new Request(`http://localhost/api/rewards/${reward.id}`, {
      method: "DELETE",
    });

    const res = await DELETE(req, { params: { id: reward.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe(reward.id);

    const check = await prisma.reward.findUnique({ where: { id: reward.id } });
    expect(check).toBeNull();
  });
});
