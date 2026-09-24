import { describe, it, expect, beforeEach } from "vitest";
import { getTransactions, addTransaction, deleteTransaction, getTransactionById } from "./transactions";

describe("transactions storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns seed data on first load", () => {
    const transactions = getTransactions();
    expect(transactions.length).toBeGreaterThan(0);
  });

  it("adds a new transaction", () => {
    const before = getTransactions().length;
    addTransaction({
      description: "Test coffee",
      amount: 5.5,
      type: "expense",
      category: "Other",
      date: "2026-01-01",
    });
    const after = getTransactions();
    expect(after.length).toBe(before + 1);
    expect(after[0].description).toBe("Test coffee");
  });

  it("deletes a transaction", () => {
    const tx = addTransaction({
      description: "To be deleted",
      amount: 10,
      type: "expense",
      category: "Other",
      date: "2026-01-01",
    });
    const beforeCount = getTransactions().length;
    deleteTransaction(tx.id);
    const afterCount = getTransactions().length;
    expect(afterCount).toBe(beforeCount - 1);
    expect(getTransactionById(tx.id)).toBeUndefined();
  });

  it("returns undefined for a nonexistent transaction id", () => {
    expect(getTransactionById("does-not-exist")).toBeUndefined();
  });
});