import { prisma } from "@/lib/prisma";

export const createReward = async (data: {
  title: string;
  unlocked?: boolean;
  userId: string;
}) => {
  return prisma.reward.create({
    data: {
      ...data,
      unlocked: data.unlocked ?? false,
    },
  });
};
export const getRewardsByUserId = async (userId: string) => {
  return prisma.reward.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteRewardById = async (id: string) => {
  return prisma.reward.delete({
    where: { id },
  });
};
