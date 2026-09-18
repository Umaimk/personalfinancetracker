import { Budget } from "./types";
import { getTransactions } from "./transactions";

const STORAGE_KEY = "fintrack:budgets";

const seedBudgets: Budget[] = [
  { category: "Groceries", limit: 300 },
  { category: "Utilities", limit: 150 },
  { category: "Entertainment", limit: 100 },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getBudgets(): Budget[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBudgets));
    return seedBudgets;
  }
  try {
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

export function setBudget(category: string, limit: number): void {
  const budgets = getBudgets();
  const existing = budgets.find((b) => b.category === category);
  let updated: Budget[];
  if (existing) {
    updated = budgets.map((b) => (b.category === category ? { ...b, limit } : b));
  } else {
    updated = [...budgets, { category, limit }];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSpentByCategory(category: string): number {
  return getTransactions()
    .filter((t) => t.type === "expense" && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}