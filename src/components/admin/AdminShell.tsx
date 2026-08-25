"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { ToastProvider } from "./Toast";
import { useEffect } from "react";

function AdminCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "admin-cursor";
    const ring = document.createElement("div");
    ring.className = "admin-cursor-ring";
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
      cursor.classList.add("visible");
      ring.classList.add("visible");
    }

    function onLeave() {
      cursor.classList.remove("visible");
      ring.classList.remove("visible");
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cursor.remove();
      ring.remove();
    };
  }, []);

  return null;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <AdminCursor />
      {pathname === "/admin/login" ? (
        <div className="min-h-screen bg-slate-100">{children}</div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-slate-50 lg:pl-0">
            {children}
          </main>
        </div>
      )}
    </ToastProvider>
  );
}