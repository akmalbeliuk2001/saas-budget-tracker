"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { apiRequest } from "@/lib/fetcher";

export default function TransactionList() {
  const {
    data: transactions,
    error,
    isLoading,
  } = useSWR("/api/transactions", apiRequest);
  const { data: categories } = useSWR("/api/categories", apiRequest);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    date: "",
    note: "",
  });

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    const token = localStorage.getItem("token");
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    mutate("/api/transactions");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch(`/api/transactions/${editId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        categoryId: form.categoryId,
        amount: parseInt(form.amount),
        date: form.date,
        note: form.note || null,
      }),
    });

    setEditId(null);
    mutate("/api/transactions");
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Gagal memuat transaksi</p>;

  return (
    <div className="mt-4 space-y-2">
      {transactions.map((t: any) => (
        <div key={t.id} className="border rounded p-3">
          {editId === t.id ? (
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="border p-2 rounded w-full"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{t.category.name}</p>
                <p className="text-sm text-gray-500">{t.note || "-"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  Rp {t.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditId(t.id);
                    setForm({
                      categoryId: t.categoryId,
                      amount: t.amount.toString(),
                      date: t.date.split("T")[0],
                      note: t.note || "",
                    });
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
