"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["All", "IT Services", "Non-IT Services", "Staffing"];
const types = ["Full-time", "Part-time", "Contract", "Internship"];

interface JobFormData {
  title: string;
  description: string;
  category: string;
  tools: string[];
  location: string;
  type: string;
  badgeLabel: string;
  badgeColor: string;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  initialData?: Partial<JobFormData>;
  jobId?: number;
}

export default function JobForm({ initialData, jobId }: Props) {
  const router = useRouter();
  const isEditing = !!jobId;

  const [form, setForm] = useState<JobFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "All",
    tools: initialData?.tools || [],
    location: initialData?.location || "",
    type: initialData?.type || "Full-time",
    badgeLabel: initialData?.badgeLabel || "",
    badgeColor: initialData?.badgeColor || "",
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  });

  const [toolInput, setToolInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function addTool() {
    const trimmed = toolInput.trim();
    if (trimmed && !form.tools.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tools: [...prev.tools, trimmed] }));
      setToolInput("");
    }
  }

  function removeTool(tool: string) {
    setForm((prev) => ({ ...prev, tools: prev.tools.filter((t) => t !== tool) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEditing ? `/api/admin/jobs/${jobId}` : "/api/admin/jobs";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
          <input
            type="number"
            name="sortOrder"
            value={form.sortOrder}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tools / Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTool(); } }}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. React"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
            >
              Add
            </button>
          </div>
          {form.tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeTool(tool)}
                    className="hover:text-red-600 transition"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Badge Label</label>
          <input
            type="text"
            name="badgeLabel"
            value={form.badgeLabel}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g. Urgent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Badge Color</label>
          <input
            type="text"
            name="badgeColor"
            value={form.badgeColor}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g. #dc3545"
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
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Job" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
