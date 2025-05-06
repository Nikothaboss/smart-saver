import db from "../db/db";
import { Currency } from "@prisma/client";

const prisma = db;

export const createTransaction = async (data: {
  date: string;
  description: string;
  amount: number;
  currency: Currency;
  accountId: string;
  userId: string;
}) => {
  return prisma.transaction.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
};

export const getTransactionsByUserId = async (userId: string) => {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      account: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const deleteTransactionById = async (id: string) => {
  return prisma.transaction.delete({
    where: { id },
  });
};
