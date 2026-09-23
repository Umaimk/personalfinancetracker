"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTransactions } from "@/lib/transactions";
import { Transaction } from "@/lib/types";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    setTransactions(getTransactions());
    setLoaded(true);
  }, []);

  async function handleGetInsights() {
    setInsightError(null);
    setInsightLoading(true);
    setInsight(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate insights.");
      }
      setInsight(data.insight);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setInsightLoading(false);
    }
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const recent = transactions.slice(0, 5);

  if (!loaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-sm text-slate-600">Balance</p>
          <p className={`mt-1 text-2xl font-semibold ${balance >= 0 ? "text-income" : "text-expense"}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-sm text-slate-600">Income</p>
          <p className="mt-1 text-2xl font-semibold text-income">${income.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-black/10 p-4">
          <p className="text-sm text-slate-600">Expenses</p>
          <p className="mt-1 text-2xl font-semibold text-expense">${expense.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-brand-light bg-brand-light p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">✨ AI Spending Insights</h2>
          <button
            onClick={handleGetInsights}
            disabled={insightLoading || transactions.length === 0}
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {insightLoading ? "Analyzing..." : "Generate Insight"}
          </button>
        </div>

        {transactions.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">Add some transactions first.</p>
        )}
        {insightError && (
          <p role="alert" className="mt-2 text-sm text-expense">
            {insightError}
          </p>
        )}
        {insight && <p className="mt-2 text-sm text-slate-700">{insight}</p>}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link href="/transactions" className="text-sm text-brand hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-3 text-slate-600">No transactions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 rounded-lg border border-black/10">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-sm text-slate-600">{t.category} &middot; {t.date}</p>
                </div>
                <span className={t.type === "income" ? "text-income" : "text-expense"}>
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}