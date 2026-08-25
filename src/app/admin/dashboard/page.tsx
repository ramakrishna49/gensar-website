import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, submissions, clientLogos, testimonials } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";

function timeAgo(dateStr: Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [[activeJobs], [allJobs], [allSubmissions], [unreadSubmissions], [activeLogos], [activeTestimonials], recentSubs, recentJobsList] = await Promise.all([
    db.select({ value: count() }).from(jobs).where(eq(jobs.isActive, true)),
    db.select({ value: count() }).from(jobs),
    db.select({ value: count() }).from(submissions),
    db.select({ value: count() }).from(submissions).where(eq(submissions.read, false)),
    db.select({ value: count() }).from(clientLogos).where(eq(clientLogos.isActive, true)),
    db.select({ value: count() }).from(testimonials).where(eq(testimonials.isActive, true)),
    db.select().from(submissions).orderBy(desc(submissions.createdAt)).limit(5),
    db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(5),
  ]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard title="Job Openings" value={String(activeJobs?.value ?? 0)} description={`${allJobs?.value ?? 0} total · ${activeJobs?.value ?? 0} active`} color="blue" />
        <StatCard title="Submissions" value={String(allSubmissions?.value ?? 0)} description={`${unreadSubmissions?.value ?? 0} unread · ${(allSubmissions?.value ?? 0) - (unreadSubmissions?.value ?? 0)} read`} color="green" />
        <StatCard title="Client Logos" value={String(activeLogos?.value ?? 0)} description="Active logos" color="purple" />
        <StatCard title="Testimonials" value={String(activeTestimonials?.value ?? 0)} description="Published" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              Recent Submissions
            </h3>
            <Link href="/admin/submissions" className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSubs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                <p className="text-sm">No submissions yet</p>
              </div>
            ) : recentSubs.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    {String((s.formData as Record<string, unknown>)?.contactName || (s.formData as Record<string, unknown>)?.careersName || (s.formData as Record<string, unknown>)?.fullName || (s.formData as Record<string, unknown>)?.reqName || (s.formData as Record<string, unknown>)?.homeName || (s.formData as Record<string, unknown>)?.name || "Unknown")}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {s.formType}
                    {!s.read && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">New</span>}
                  </div>
                </div>
                <div className="text-xs text-slate-400">{timeAgo(s.createdAt!)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              Active Job Openings
            </h3>
            <Link href="/admin/jobs" className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentJobsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>
                <p className="text-sm">No jobs posted yet</p>
              </div>
            ) : recentJobsList.map((j) => (
              <div key={j.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">{j.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{j.location} &middot; {j.type}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${j.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {j.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, color }: { title: string; value: string; description: string; color: "blue" | "green" | "purple" | "amber" }) {
  const colors = { blue: "bg-blue-50 border-blue-200 text-blue-700", green: "bg-emerald-50 border-emerald-200 text-emerald-700", purple: "bg-purple-50 border-purple-200 text-purple-700", amber: "bg-amber-50 border-amber-200 text-amber-700" };
  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1 opacity-70">{description}</p>
    </div>
  );
}
