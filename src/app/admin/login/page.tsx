"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <img
            src="/img/gensar_logo.png"
            alt="Gensar"
            className="h-20 sm:h-24 w-auto mx-auto"
          />
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <i className="fa-solid fa-shield-halved text-blue-600"></i>
            Gensar Admin
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to manage your website</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-envelope text-slate-400"></i>
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="admin@example.com"
                required
              />
              <i className="fa-solid fa-user text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm"></i>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-lock text-slate-400"></i>
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
              />
              <i className="fa-solid fa-key text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm"></i>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fa-solid fa-right-to-bracket"></i> Sign In</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Gensar IT Solution. All rights reserved.
        </p>
      </div>
    </div>
  );
}
