import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoForm from "@/components/admin/LogoForm";

export default async function NewLogoPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add Client Logo</h1>
        <p className="text-slate-500 mt-1">Add a new client logo for the website.</p>
      </div>
      <LogoForm />
    </div>
  );
}
