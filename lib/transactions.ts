import { Transaction } from "./types";

const STORAGE_KEY = "fintrack:transactions";

// Seed data so the app isn't empty on first load
const seedTransactions: Transaction[] = [
  {
    id: "1",
    description: "Monthly salary",
    amount: 3500,
    type: "income",
    category: "Salary",
    date: "2026-08-01",
  },
  {
    id: "2",
    description: "Grocery shopping",
    amount: 120.5,
    type: "expense",
    category: "Groceries",
    date: "2026-08-05",
  },
  {
    id: "3",
    description: "Electricity bill",
    amount: 60,
    type: "expense",
    category: "Utilities",
    date: "2026-08-10",
  },
  {
    id: "4",
    description: "Freelance project",
    amount: 450,
    type: "income",
    category: "Freelance",
    date: "2026-08-15",
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getTransactions(): Transaction[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTransactions));
    return seedTransactions;
  }
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export function addTransaction(tx: Omit<Transaction, "id">): Transaction {
  const transactions = getTransactions();
  const newTx: Transaction = { ...tx, id: crypto.randomUUID() };
  const updated = [newTx, ...transactions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newTx;
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function getTransactionById(id: string): Transaction | undefined {
  return getTransactions().find((t) => t.id === id);
}