"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./Toast";

export default function DeleteJobButton({
  jobId,
  title,
}: {
  jobId: number;
  title: string;
}) {
  const router = useRouter();
  const { confirm, toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = await confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to delete", "error");
        return;
      }
      toast("Job deleted successfully", "success");
      router.refresh();
    } catch {
      toast("Failed to delete job", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleDelete}
      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
