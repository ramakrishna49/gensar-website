import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [t] = await db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1);
  if (!t) redirect("/admin/testimonials");

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Edit Testimonial</h1></div>
      <TestimonialForm testimonialId={t.id} initialData={{ name: t.name, role: t.role, company: t.company, avatarUrl: t.avatarUrl || undefined, content: t.content, rating: t.rating, pageSection: t.pageSection, isActive: t.isActive, sortOrder: t.sortOrder }} />
    </div>
  );
}
