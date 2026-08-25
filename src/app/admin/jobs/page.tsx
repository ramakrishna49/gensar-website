import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { desc } from "drizzle-orm";
import DeleteJobButton from "@/components/admin/DeleteJobButton";

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.sortOrder), desc(jobs.createdAt));

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Job Openings</h1>
          <p className="text-slate-500 mt-1">{allJobs.length} job{allJobs.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/admin/jobs/new" className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm text-center">+ New Job</Link>
      </div>

      {allJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg mb-2">No job openings yet</p>
          <p className="text-slate-400 text-sm">Create your first job posting to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-slate-900">{job.title}</div>
                      {job.tools && job.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.tools.slice(0, 3).map((tool) => (
                            <span key={tool} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{tool}</span>
                          ))}
                          {job.tools.length > 3 && <span className="px-2 py-0.5 text-slate-400 text-xs">+{job.tools.length - 3}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{job.category}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{job.location || "--"}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{job.type}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${job.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.badgeLabel && <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: job.badgeColor || "#6b7280" }}>{job.badgeLabel}</span>}
                        <Link href={`/admin/jobs/${job.id}/edit`} className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">Edit</Link>
                        <DeleteJobButton jobId={job.id} title={job.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
