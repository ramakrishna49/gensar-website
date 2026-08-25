"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./Toast";

export default function DeleteButton({
  endpoint,
  label,
  redirectOnDelete,
}: {
  endpoint: string;
  label: string;
  redirectOnDelete?: string;
}) {
  const router = useRouter();
  const { confirm, toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = await confirm(`Delete "${label}"? This cannot be undone.`);
    if (!ok) return;
    setLoading(true);

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "Failed to delete", "error");
        return;
      }
      toast("Deleted successfully", "success");
      if (redirectOnDelete) {
        router.push(redirectOnDelete);
      }
      router.refresh();
    } catch {
      toast("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleDelete}
      className="flex-1 text-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
