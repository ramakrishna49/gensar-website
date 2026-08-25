"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";

interface Submission {
  id: number;
  formType: string;
  formData: Record<string, unknown>;
  resumeUrl: string | null;
  read: boolean;
  createdAt: string;
}

const formTypeLabels: Record<string, string> = {
  contact: "Contact",
  careers: "Job Application",
  consultation: "Internship Registration",
  requirement: "Share Requirement",
  home_consultation: "Consultation",
  newsletter: "Newsletter",
};

const formTypeIcons: Record<string, string> = {
  contact: "fa-solid fa-envelope",
  careers: "fa-solid fa-briefcase",
  consultation: "fa-solid fa-graduation-cap",
  requirement: "fa-solid fa-handshake",
  home_consultation: "fa-solid fa-headset",
  newsletter: "fa-solid fa-newspaper",
};

export default function SubmissionsPage() {
  const router = useRouter();
  const { confirm, toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRead, setFilterRead] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [filterType, filterRead]);

  async function fetchSubmissions() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set("form_type", filterType);
    if (filterRead) params.set("read", filterRead);

    try {
      const res = await fetch(`/api/admin/submissions?${params}`);
      if (res.ok) {
        setSubmissions(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: number) {
    setTogglingId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to toggle read status");
      toast("Read status updated", "success");
      fetchSubmissions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteSubmission(id: number, name: string) {
    const ok = await confirm(`Delete submission #${id} from "${name}"?`);
    if (!ok) return;
    setDeletingId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete submission");
      toast("Submission deleted", "success");
      fetchSubmissions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  function downloadResume(url: string, filename: string) {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename || "resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 60000);
      })
      .catch(() => toast("Download failed", "error"));
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
          <p className="text-slate-500 mt-1">
            {submissions.length} total
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        <a
          href="/api/admin/submissions/export"
          className="self-start sm:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition text-sm text-center"
        >
          Export CSV
        </a>
      </div>

      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex-1 min-w-[160px] px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {Object.entries(formTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="flex-1 min-w-[140px] px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resume</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((s) => {
                  const data = s.formData as Record<string, unknown>;
                  const name = String(
                    data.contactName || data.careersName || data.fullName || data.reqName || data.homeName || data.name || ""
                  );
                  const email = String(
                    data.contactEmail || data.careersEmail || data.emailAddr || data.reqEmail || data.homeEmail || data.email || ""
                  );

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50 transition ${!s.read ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <i className={formTypeIcons[s.formType] || "fa-solid fa-file"}></i>
                          {formTypeLabels[s.formType] || s.formType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Link
                          href={`/admin/submissions/${s.id}`}
                          className="font-medium text-slate-900 hover:text-blue-600 transition"
                        >
                          {name || `#${s.id}`}
                        </Link>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{email || "--"}</td>
                      <td className="px-4 sm:px-6 py-4">
                        {s.resumeUrl ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <i className="fa-solid fa-file-pdf text-red-500 text-xs"></i>
                            <span className="text-xs text-slate-500 truncate max-w-[100px]">{s.resumeUrl.split('/').pop()?.split('?')[0] || 'resume'}</span>
                            <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition font-medium" title="View"><i className="fa-solid fa-eye"></i></a>
                            <button onClick={() => downloadResume(s.resumeUrl!, s.resumeUrl!.split('/').pop()?.split('?')[0] || 'resume')} className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition font-medium" title="Download"><i className="fa-solid fa-download"></i></button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 italic">--</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => toggleRead(s.id)}
                          disabled={togglingId === s.id}
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                            s.read
                              ? "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              : "bg-blue-100 text-blue-700 hover:bg-slate-100 hover:text-slate-500"
                          }`}
                        >
                          {s.read ? "Read" : "Unread"}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/submissions/${s.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => deleteSubmission(s.id, name)}
                            disabled={deletingId === s.id}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50"
                          >
                            {deletingId === s.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
