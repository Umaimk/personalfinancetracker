"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/transactions";
import { getBudgets } from "@/lib/budgets";

export default function SettingsPage() {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [counts, setCounts] = useState({ transactions: 0, budgets: 0 });

  useEffect(() => {
    setCounts({
      transactions: getTransactions().length,
      budgets: getBudgets().length,
    });
  }, [resetDone]);

  function handleResetData() {
    localStorage.removeItem("fintrack:transactions");
    localStorage.removeItem("fintrack:budgets");
    setResetDone(true);
    setConfirmingReset(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="mt-6 max-w-md space-y-6">
        <div className="rounded-lg border border-black/10 p-4">
          <h2 className="text-sm font-semibold">Data Overview</h2>
          <p className="mt-1 text-sm text-slate-600">
            {counts.transactions} transaction{counts.transactions !== 1 ? "s" : ""},{" "}
            {counts.budgets} budget{counts.budgets !== 1 ? "s" : ""} stored locally in this
            browser.
          </p>
        </div>

        <div className="rounded-lg border border-black/10 p-4">
          <h2 className="text-sm font-semibold">Reset Data</h2>
          <p className="mt-1 text-sm text-slate-600">
            Clears all transactions and budgets and restores the demo seed data on next visit.
            This cannot be undone.
          </p>

          {resetDone && (
            <p role="status" className="mt-2 rounded-md bg-income/10 px-3 py-2 text-sm text-income">
              Data reset. Reload any page to see fresh demo data.
            </p>
          )}

          {!confirmingReset ? (
            <button
              onClick={() => setConfirmingReset(true)}
              className="mt-3 rounded-md border border-expense px-4 py-2 text-sm font-medium text-expense hover:bg-red-50"
            >
              Reset All Data
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-slate-600">Are you sure?</span>
              <button
                onClick={handleResetData}
                className="rounded-md bg-expense px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}