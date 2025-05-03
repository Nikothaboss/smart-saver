import { describe, it, expect } from "vitest";
import {
  getAccountById,
  createAccount,
  deleteAccountById,
} from "@/lib/services/accountService";
import { Currency } from "@prisma/client";
import { testUserId } from "../utils";

const userId = testUserId; // Replace with a valid ID

describe("accountService", () => {
  let createdAccountId: string;

  it("should create a new account for a user", async () => {
    const account = await createAccount({
      accountNumber: "****4321",
      accountType: "Checking",
      balance: 7500,
      currency: Currency.NOK,
      userId,
    });

    expect(account).toBeDefined();
    expect(account.userId).toBe(userId);
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
      userId,
    });

    const deleted = await deleteAccountById(account.id);
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(account.id);
  });
});
