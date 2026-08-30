"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTransaction } from "@/lib/transactions";
import { TransactionType } from "@/lib/types";

const categories = [
  "Salary",
  "Freelance",
  "Groceries",
  "Utilities",
  "Rent",
  "Transport",
  "Entertainment",
  "Other",
];

export default function NewTransactionPage() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState(categories[2]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
    });

    router.push("/transactions");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Transaction</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-expense">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            placeholder="e.g. Grocery shopping"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-medium">Type</legend>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === "expense"}
                onChange={() => setType("expense")}
              />
              Expense
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === "income"}
                onChange={() => setType("income")}
              />
              Income
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Add Transaction
          </button>
          <button
            type="button"
            onClick={() => router.push("/transactions")}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}