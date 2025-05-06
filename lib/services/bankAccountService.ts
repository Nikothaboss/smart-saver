import db from "../db/db";
import { Currency } from "@prisma/client";

const prisma = db;

export const getBankAccountById = async (id: string) => {
  return prisma.bankAccount.findUnique({
    where: { id },
    include: {
      transactions: true,
    },
  });
};

export const createBankAccount = async (data: {
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: Currency;
  userId: string;
}) => {
  return prisma.bankAccount.create({
    data,
  });
};

export const deleteBankAccountById = async (id: string) => {
  return prisma.bankAccount.delete({
    where: { id },
  });
};
