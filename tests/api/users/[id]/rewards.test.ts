import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/users/[id]/rewards/route";
import db from "@/lib/db/db";

const prisma = db;

describe("GET /api/users/:id/rewards", () => {
  it("should return rewards for a user", async () => {
    const user = await prisma.user.findFirst({
      include: { rewards: true },
    });

    if (!user) throw new Error("No test user found — seed one first");

    const req = new Request(`http://localhost/api/users/${user.id}/rewards`);
    const res = await GET(req, { params: { id: user.id } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    if (json.length > 0) {
      expect(json[0]).toHaveProperty("title");
      expect(json[0]).toHaveProperty("unlocked");
    }
  });
});
