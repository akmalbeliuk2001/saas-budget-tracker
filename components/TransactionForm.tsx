"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { apiRequest } from "@/lib/fetcher";

export default function TransactionForm() {
  const { data: categories } = useSWR("/api/categories", apiRequest);
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [loading, setLoading] = useState(false);

  if (!categories) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: form.categoryId,
          amount: parseInt(form.amount),
          date: new Date(form.date),
          note: form.note || null,
        }),
      });
      setForm({
        categoryId: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      mutate("/api/transactions"); // refresh data
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <select
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        className="border rounded p-2 w-full"
        required
      >
        <option value="">Pilih Kategori</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="border rounded p-2 w-full"
        required
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="border rounded p-2 w-full"
        required
      />

      <input
        type="text"
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        className="border rounded p-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Menyimpan..." : "Tambah Transaksi"}
      </button>
    </form>
  );
}
