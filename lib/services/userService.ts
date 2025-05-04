import { prisma } from "@/lib/prisma";

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      goals: true,
      rewards: true,
    },
  });
};

export const getUserGoals = async (userId: string) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserRewards = async (userId: string) => {
  return prisma.reward.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserTransactions = async (userId: string) => {
  return prisma.transaction.findMany({
    where: {
      account: {
        userId,
      },
    },
    include: {
      account: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const createUser = async (data: { name: string; email: string }) => {
  return prisma.user.create({
    data,
  });
};

export const deleteUserById = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
