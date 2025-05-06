import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db/db";

const prisma = db;
/**
 * @swagger
 * /api/goals/{id}/contribute:
 *   post:
 *     summary: Contribute to a goal
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Goal updated
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Goal or user not found
 */

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return new NextResponse(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
      });
    }

    // Find the goal
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
    });

    if (!goal) {
      return new NextResponse(JSON.stringify({ error: "Goal not found" }), {
        status: 404,
      });
    }

    // Check if the goal belongs to the user
    if (goal.userId !== user.id) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        currentAmount: goal.currentAmount + amount,
      },
    });

    // Check if goal is completed and create a reward if needed
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      // Check if a reward for this goal already exists
      const existingReward = await prisma.reward.findFirst({
        where: {
          userId: user.id,
          title: `Completed Goal: ${updatedGoal.title}`,
        },
      });

      if (!existingReward) {
        // Create a reward
        await prisma.reward.create({
          data: {
            title: `Completed Goal: ${updatedGoal.title}`,
            unlocked: true,
            userId: user.id,
          },
        });
      }
    }

    return new NextResponse(JSON.stringify(updatedGoal));
  } catch (error) {
    console.error("Error contributing to goal:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}
