import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import JobForm from "@/components/admin/JobForm";

export default async function NewJobPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create Job Opening</h1>
        <p className="text-slate-500 mt-1">Add a new job listing for the careers page.</p>
      </div>
      <JobForm />
    </div>
  );
}
