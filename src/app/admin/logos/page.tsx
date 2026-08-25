import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { desc } from "drizzle-orm";
import Image from "next/image";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function LogosPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const allLogos = await db.select().from(clientLogos).orderBy(desc(clientLogos.displayOrder), desc(clientLogos.createdAt));

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Client Logos</h1>
          <p className="text-slate-500 mt-1">{allLogos.length} logo{allLogos.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/logos/new" className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm text-center">+ Add Logo</Link>
      </div>

      {allLogos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center"><p className="text-slate-400 text-lg">No logos yet</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allLogos.map((logo) => (
            <div key={logo.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center gap-3">
              <div className="w-full h-24 relative flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                <Image src={logo.imageUrl} alt={logo.altText || "Client logo"} width={120} height={60} className="object-contain max-h-full" unoptimized />
              </div>
              <p className="text-sm text-slate-600 text-center truncate w-full">{logo.altText || "No alt text"}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${logo.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{logo.isActive ? "Active" : "Inactive"}</span>
                <span className="text-slate-400">#{logo.displayOrder}</span>
              </div>
              <div className="flex gap-2 w-full">
                <Link href={`/admin/logos/${logo.id}/edit`} className="flex-1 text-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">Edit</Link>
                <DeleteButton endpoint={`/api/admin/logos/${logo.id}`} label={logo.altText || `logo #${logo.id}`} redirectOnDelete="/admin/logos" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
