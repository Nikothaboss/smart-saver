import { describe, it, expect } from "vitest";
import {
  getBankAccountById,
  createBankAccount,
  deleteBankAccountById,
} from "@/lib/services/bankAccountService"; // updated import
import { Currency } from "@prisma/client";
import db from "@/lib/db/db";

const prisma = db;

describe("bankAccountService", async () => {
  let createdAccountId: string;

  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found — seed a user first.");

  it("should create a new bank account for a user", async () => {
    const account = await createBankAccount({
      accountNumber: "****4321",
      accountType: "Checking",
      balance: 7500,
      currency: Currency.NOK,
      userId: user.id,
    });

    expect(account).toBeDefined();
    expect(account.userId).toBe(user.id);
    expect(account.accountType).toBe("Checking");

    createdAccountId = account.id;
  });

  it("should return the bank account with transactions", async () => {
    const account = await getBankAccountById(createdAccountId);
    expect(account).toBeDefined();
    expect(account?.id).toBe(createdAccountId);
    expect(Array.isArray(account?.transactions)).toBe(true);
  });

  it("should return null for non-existent bank account", async () => {
    const result = await getBankAccountById("non-existent-id");
    expect(result).toBeNull();
  });

  it("should delete a bank account", async () => {
    const account = await createBankAccount({
      accountNumber: "****DEL",
      accountType: "Test",
      balance: 123,
      currency: Currency.NOK,
      userId: user.id,
    });

    const deleted = await deleteBankAccountById(account.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(account.id);
  });
});
