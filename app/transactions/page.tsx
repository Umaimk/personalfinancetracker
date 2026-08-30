"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTransactions, deleteTransaction } from "@/lib/transactions";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    deleteTransaction(id);
    setTransactions(getTransactions());
  }

  if (!loaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link
          href="/transactions/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="mt-6 text-slate-600">No transactions yet. Add your first one.</p>
      ) : (
        <ul className="mt-6 divide-y divide-black/10 rounded-lg border border-black/10">
          {transactions.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-4 py-3">
              <Link href={`/transactions/${t.id}`} className="flex-1">
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-slate-500">
                  {t.category} &middot; {t.date}
                </p>
              </Link>
              <div className="flex items-center gap-4">
                <span className={t.type === "income" ? "text-income" : "text-expense"}>
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-sm text-slate-400 hover:text-expense"
                  aria-label={`Delete ${t.description}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}