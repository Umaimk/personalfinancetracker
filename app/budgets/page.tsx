"use client";

import { useEffect, useState } from "react";
import { getBudgets, setBudget, getSpentByCategory } from "@/lib/budgets";
import { Budget } from "@/lib/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBudgets(getBudgets());
    setLoaded(true);
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!newCategory.trim()) {
      setError("Category is required.");
      return;
    }
    const parsedLimit = parseFloat(newLimit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      setError("Enter a valid limit greater than 0.");
      return;
    }

    setBudget(newCategory.trim(), parsedLimit);
    setBudgets(getBudgets());
    setNewCategory("");
    setNewLimit("");
  }

  if (!loaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Budgets</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Budgets</h1>

      {budgets.length === 0 ? (
        <p className="mt-6 text-slate-600">No budgets set yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {budgets.map((b) => {
            const spent = getSpentByCategory(b.category);
            const pct = Math.min((spent / b.limit) * 100, 100);
            const overBudget = spent > b.limit;

            return (
              <li key={b.category} className="rounded-lg border border-black/10 p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{b.category}</span>
                  <span className={overBudget ? "text-expense" : "text-slate-600"}>
                    ${spent.toFixed(2)} / ${b.limit.toFixed(2)}
                  </span>
                </div>
                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${b.category} budget usage`}
                >
                  <div
                    className={`h-full rounded-full ${overBudget ? "bg-expense" : "bg-brand"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {overBudget && (
                  <p className="mt-1 text-xs text-expense">
                    Over budget by ${(spent - b.limit).toFixed(2)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-8 max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Set a Budget</h2>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-expense">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            placeholder="e.g. Transport"
          />
        </div>

        <div>
          <label htmlFor="limit" className="block text-sm font-medium">
            Monthly Limit
          </label>
          <input
            id="limit"
            type="number"
            step="0.01"
            min="0"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Set Budget
        </button>
      </form>
    </div>
  );
}