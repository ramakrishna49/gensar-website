import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";

const formTypeLabels: Record<string, string> = { contact: "Contact Form", careers: "Job Application", consultation: "Internship Registration", requirement: "Share Your Requirement", home_consultation: "Home Consultation", newsletter: "Newsletter Subscription" };

const fieldLabels: Record<string, string> = {
  contactName: "Full Name", contactEmail: "Email", contactPhone: "Phone", contactCompany: "Company",
  contactMessage: "Message",
  careersName: "Full Name", careersDob: "Date of Birth", careersEmail: "Email", careersPhone: "Phone",
  experience: "Experience", passoutYear: "Year of Pass Out", applyPosition: "Position Applying For",
  coverLetter: "Cover Letter",
  fullName: "Full Name", emailAddr: "Email", phoneNum: "Phone", courseInterest: "Course of Interest",
  reqName: "Your Name", reqEmail: "Your Email", reqCompany: "Company", reqPhone: "Phone",
  reqService: "Service Needed", reqMessage: "Message",
  homeName: "Name", homeEmail: "Email", homePhone: "Phone", homeMessage: "Message",
  name: "Name", email: "Email",
};

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
  if (!submission) redirect("/admin/submissions");

  const data = submission.formData as Record<string, unknown>;
  const excludeFields = ["agreeCheck", "contactAgreeCheck", "homeAgreeCheck", "careersAgreeCheck"];

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/submissions" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">&larr; Back to Submissions</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{formTypeLabels[submission.formType] || submission.formType}</h1>
            <p className="text-slate-500 mt-1 text-sm">Submitted on {new Date(submission.createdAt).toLocaleString()}{submission.read ? " · Read" : " · Unread"}</p>
          </div>
          {submission.resumeUrl && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
                <i className="fa-solid fa-eye"></i> View Resume
              </a>
              <a href={submission.resumeUrl} download className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium text-sm">
                <i className="fa-solid fa-download"></i> Download Resume
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {Object.entries(data).map(([key, value]) => {
          if (excludeFields.includes(key)) return null;
          const displayValue = String(value ?? "");
          const label = fieldLabels[key] || key.replace(/([A-Z])/g, " $1").replace(/^(.)/, (c) => c.toUpperCase());
          return (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
              <div className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 text-sm border border-slate-100">
                {displayValue || <span className="text-slate-300 italic">Not provided</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
