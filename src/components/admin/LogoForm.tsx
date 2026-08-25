"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

interface LogoFormData {
  imageUrl: string;
  altText: string;
  section: string;
  displayOrder: number;
  isActive: boolean;
}

interface Props {
  initialData?: Partial<LogoFormData>;
  logoId?: number;
}

export default function LogoForm({ initialData, logoId }: Props) {
  const router = useRouter();
  const isEditing = !!logoId;

  const [form, setForm] = useState<LogoFormData>({
    imageUrl: initialData?.imageUrl || "",
    altText: initialData?.altText || "",
    section: initialData?.section || "home",
    displayOrder: initialData?.displayOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEditing ? `/api/admin/logos/${logoId}` : "/api/admin/logos";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, displayOrder: Number(form.displayOrder) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/logos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save logo");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <ImageUpload
        currentUrl={form.imageUrl}
        onUploaded={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Alt Text</label>
        <input
          type="text"
          name="altText"
          value={form.altText}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Client name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
        <select
          name="section"
          value={form.section}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="services">Services</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
        <input
          type="number"
          name="displayOrder"
          value={form.displayOrder}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-slate-700">Active</label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Logo" : "Add Logo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/logos")}
          className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}