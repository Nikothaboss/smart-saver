import { describe, it, expect } from "vitest";
import {
  getAccountById,
  createAccount,
  deleteAccountById,
} from "@/lib/services/accountService";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe("accountService", async () => {
  let createdAccountId: string;
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found — seed a user first.");

  it("should create a new account for a user", async () => {
    if (!user) throw new Error("No user found — seed a user first.");
    const account = await createAccount({
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

  it("should return the account with transactions", async () => {
    const account = await getAccountById(createdAccountId);
    expect(account).toBeDefined();
    expect(account?.id).toBe(createdAccountId);
    expect(Array.isArray(account?.transactions)).toBe(true);
  });

  it("should return null for non-existent account", async () => {
    const result = await getAccountById("non-existent-id");
    expect(result).toBeNull();
  });

  it("should delete an account", async () => {
    const account = await createAccount({
      accountNumber: "****DEL",
      accountType: "Test",
      balance: 123,
      currency: Currency.NOK,
      userId: user.id,
    });

    const deleted = await deleteAccountById(account.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(account.id);
  });
});
