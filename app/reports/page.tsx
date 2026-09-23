"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/transactions";
import { Transaction } from "@/lib/types";

interface CategoryTotal {
  category: string;
  total: number;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </div>
    );
  }

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const byCategory: Record<string, number> = {};
  for (const t of expenses) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  }

  const categoryTotals: CategoryTotal[] = Object.entries(byCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const topCategory = categoryTotals[0];

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>

      {transactions.length === 0 ? (
        <p className="mt-6 text-slate-600">No transactions yet — add some to see reports.</p>
      ) : expenses.length === 0 ? (
        <p className="mt-6 text-slate-600">No expenses recorded yet.</p>
      ) : (
        <>
          <div className="mt-6 rounded-lg border border-black/10 p-4">
            <p className="text-sm text-slate-600">Total Spending</p>
            <p className="mt-1 text-2xl font-semibold text-expense">
              ${totalExpenses.toFixed(2)}
            </p>
            {topCategory && (
              <p className="mt-1 text-sm text-slate-600">
                Biggest category: <span className="font-medium">{topCategory.category}</span> ($
                {topCategory.total.toFixed(2)})
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Spending by Category</h2>
            <ul className="mt-3 space-y-3">
              {categoryTotals.map((c) => {
                const pct = (c.total / totalExpenses) * 100;
                return (
                  <li key={c.category}>
                    <div className="flex justify-between text-sm">
                      <span>{c.category}</span>
                      <span className="text-slate-600">
                        ${c.total.toFixed(2)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div
                      className="mt-1 h-2 w-full overflow-hidden rounded-full bg-black/10"
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${c.category} share of total spending`}
                    >
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}