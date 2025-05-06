import { describe, it, expect } from "vitest";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionsByUserId,
} from "@/lib/services/transactionService";
import { Currency } from "@prisma/client";
import db from "@/lib/db/db";

const prisma = db;

describe("transactionService", async () => {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found — seed a user first.");

  const userId = user.id;

  const account = await prisma.bankAccount.findFirst({
    where: { userId: userId },
  });

  const accountId = account?.id;
  if (!accountId) throw new Error("No bank account found — seed one first.");

  it("should create a transaction for a bank account", async () => {
    const transaction = await createTransaction({
      date: new Date().toISOString(),
      description: "Test Transaction",
      amount: -45.0,
      currency: Currency.NOK,
      accountId,
      userId,
    });

    expect(transaction).toBeDefined();
    expect(transaction.accountId).toBe(accountId);
    expect(transaction.description).toBe("Test Transaction");
  });

  it("should return transactions for a user", async () => {
    const transactions = await getTransactionsByUserId(userId);
    expect(Array.isArray(transactions)).toBe(true);
    if (transactions.length > 0) {
      expect(transactions[0]).toHaveProperty("account");
    }
  });

  it("should delete a transaction", async () => {
    const transaction = await createTransaction({
      date: new Date().toISOString(),
      description: "Temp Delete Test",
      amount: -10,
      currency: Currency.NOK,
      accountId,
      userId,
    });

    const deleted = await deleteTransactionById(transaction.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(transaction.id);
  });
});
