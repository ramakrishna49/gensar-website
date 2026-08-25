import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import JobForm from "@/components/admin/JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [job] = await db.select().from(jobs).where(eq(jobs.id, Number(id))).limit(1);
  if (!job) redirect("/admin/jobs");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit Job</h1>
        <p className="text-slate-500 mt-1">Update the job listing details.</p>
      </div>
      <JobForm jobId={job.id} initialData={{ title: job.title, description: job.description, category: job.category, tools: job.tools ?? [], location: job.location, type: job.type, badgeLabel: job.badgeLabel || undefined, badgeColor: job.badgeColor || undefined, isActive: job.isActive, sortOrder: job.sortOrder }} />
    </div>
  );
}
