"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/fetcher";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  async function loadCategories() {
    const data = await apiRequest("/api/categories", "GET");
    setCategories(data);
  }

  async function addCategory() {
    await apiRequest("/api/categories", "POST", { name, color });
    setName("");
    setColor("#000000");
    loadCategories();
  }

  async function deleteCategory(id: string) {
    await apiRequest(`/api/categories/${id}`, "DELETE");
    loadCategories();
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Form add category */}
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      {/* List category */}
      <ul>
        {categories.map((cat: any) => (
          <li key={cat.id} className="flex items-center gap-2 mb-2">
            <span
              className="w-4 h-4 inline-block"
              style={{ backgroundColor: cat.color }}
            ></span>
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
