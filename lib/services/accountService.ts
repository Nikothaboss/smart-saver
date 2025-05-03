import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

export const getAccountById = async (id: string) => {
  return prisma.account.findUnique({
    where: { id },
    include: {
      transactions: true,
    },
  });
};

export const createAccount = async (data: {
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: Currency;
  userId: string;
}) => {
  return prisma.account.create({
    data,
  });
};
export const deleteAccountById = async (id: string) => {
  return prisma.account.delete({
    where: { id },
  });
};
