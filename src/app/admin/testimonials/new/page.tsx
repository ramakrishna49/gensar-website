import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function NewTestimonialPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Testimonial</h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
