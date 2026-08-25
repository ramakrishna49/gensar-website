import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import LogoForm from "@/components/admin/LogoForm";

export default async function EditLogoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [logo] = await db.select().from(clientLogos).where(eq(clientLogos.id, Number(id))).limit(1);
  if (!logo) redirect("/admin/logos");

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Edit Logo</h1></div>
      <LogoForm logoId={logo.id} initialData={{ imageUrl: logo.imageUrl, altText: logo.altText, section: logo.section, displayOrder: logo.displayOrder, isActive: logo.isActive }} />
    </div>
  );
}
