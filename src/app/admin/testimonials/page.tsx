import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { desc } from "drizzle-orm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function TestimonialsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const all = await db.select().from(testimonials).orderBy(desc(testimonials.sortOrder), desc(testimonials.createdAt));

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1">{all.length} testimonial{all.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/testimonials/new" className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm text-center">+ New Testimonial</Link>
      </div>

      {all.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center"><p className="text-slate-400 text-lg">No testimonials yet</p></div>
      ) : (
        <div className="grid gap-4">
          {all.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">{(t.avatarUrl) ? <img src={t.avatarUrl} alt={t.name || ""} className="w-full h-full object-cover" /> : <span>{(t.name || "?").charAt(0).toUpperCase()}</span>}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="text-sm text-slate-500">{[t.role, t.company].filter(Boolean).join(" · ") || "No details"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${t.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{t.isActive ? "Active" : "Inactive"}</span>
                  <span className="text-sm text-amber-500">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                </div>
              </div>
              <p className="mt-3 text-slate-600 text-sm line-clamp-2">{t.content}</p>
              <div className="mt-3 flex gap-2">
                <Link href={`/admin/testimonials/${t.id}/edit`} className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">Edit</Link>
                <DeleteButton endpoint={`/api/admin/testimonials/${t.id}`} label={t.name} redirectOnDelete="/admin/testimonials" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
