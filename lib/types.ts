export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string, e.g. "2026-08-29"
}
export interface Budget {
  category: string;
  limit: number;
}