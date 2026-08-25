"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
  pageSection: string;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  initialData?: Partial<TestimonialFormData>;
  testimonialId?: number;
}

export default function TestimonialForm({ initialData, testimonialId }: Props) {
  const router = useRouter();
  const isEditing = !!testimonialId;

  const [form, setForm] = useState<TestimonialFormData>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    company: initialData?.company || "",
    avatarUrl: initialData?.avatarUrl || "",
    content: initialData?.content || "",
    rating: initialData?.rating ?? 5,
    pageSection: initialData?.pageSection || "home",
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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

    const url = isEditing ? `/api/admin/testimonials/${testimonialId}` : "/api/admin/testimonials";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
          sortOrder: Number(form.sortOrder),
          avatarUrl: form.avatarUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save testimonial");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <ImageUpload
        currentUrl={form.avatarUrl}
        onUploaded={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g. CEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
          <select
            name="pageSection"
            value={form.pageSection}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="services">Services</option>
          </select>
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Testimonial" : "Create Testimonial"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/testimonials")}
          className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
