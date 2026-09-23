"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTransactionById, deleteTransaction } from "@/lib/transactions";
import { Transaction } from "@/lib/types";

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null | undefined>(undefined);

  useEffect(() => {
    const tx = getTransactionById(params.id);
    setTransaction(tx ?? null);
  }, [params.id]);

  function handleDelete() {
    if (!transaction) return;
    deleteTransaction(transaction.id);
    router.push("/transactions");
  }

  // Loading state
  if (transaction === undefined) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Transaction Detail</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </div>
    );
  }

  // Not found state
  if (transaction === null) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Transaction Not Found</h1>
        <p className="mt-2 text-slate-600">
          This transaction may have been deleted or the link is incorrect.
        </p>
        <Link href="/transactions" className="mt-4 inline-block text-brand hover:underline">
          Back to Transactions
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{transaction.description}</h1>

      <div className="mt-6 max-w-md rounded-lg border border-black/10 p-4">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Amount</dt>
            <dd className={transaction.type === "income" ? "text-income" : "text-expense"}>
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Type</dt>
            <dd className="capitalize">{transaction.type}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Category</dt>
            <dd>{transaction.category}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Date</dt>
            <dd>{transaction.date}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleDelete}
          className="rounded-md border border-expense px-4 py-2 text-sm font-medium text-expense hover:bg-red-50"
        >
          Delete
        </button>
        <Link
          href="/transactions"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Back to Transactions
        </Link>
      </div>
    </div>
  );
}