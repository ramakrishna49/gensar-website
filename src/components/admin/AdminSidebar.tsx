"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "fa-solid fa-chart-pie" },
  { label: "Job Openings", href: "/admin/jobs", icon: "fa-solid fa-briefcase" },
  { label: "Submissions", href: "/admin/submissions", icon: "fa-solid fa-file-lines" },
  { label: "Client Logos", href: "/admin/logos", icon: "fa-solid fa-building" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "fa-solid fa-star" },
  { label: "Settings", href: "/admin/settings", icon: "fa-solid fa-gear" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-slate-800 text-white p-2.5 rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-slate-800 text-white flex flex-col shrink-0 transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img src="/img/Gensar Main Logo 2400x1800.jpg.jpeg" alt="Gensar" className="h-14 w-auto" />
            <span className="text-base font-bold tracking-tight">Admin</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <i className={`${item.icon} w-5 text-center text-base`}></i>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <button
            onClick={async () => {
              try {
                await signOut({ redirect: false });
              } catch {}
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:ring-1 hover:ring-red-400/40 w-full transition cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
