import { User } from "@prisma/client";
import db from "../db/db";

const prisma = db;

export const createGoal = async (data: {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  userId: string;
}) => {
  return prisma.goal.create({
    data: {
      title: data.title,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      userId: data.userId,
    },
  });
};

export const updateGoal = async (
  id: string,
  data: {
    title?: string;
    targetAmount?: number;
    currentAmount?: number;
  }
) => {
  return prisma.goal.update({
    where: { id },
    data,
  });
};

export const getGoalsByUserId = async (userId: string) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteGoalById = async (id: string) => {
  return prisma.goal.delete({
    where: { id },
  });
};
