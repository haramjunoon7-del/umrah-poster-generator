
"use client";

import { useState } from "react";

export default function AccessPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Incorrect password.");
        return;
      }

      window.location.replace("/");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111A17] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#C79A4C]/40 bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#173E30] text-3xl">
          🕋
        </div>

        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#A87935]">
          Haram Junoon Travels & Tours
        </p>

        <h1 className="mt-3 text-center text-2xl font-black text-slate-900">
          Client Access
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter your access password to open the system.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter access password"
            required
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#C79A4C] focus:ring-2 focus:ring-[#C79A4C]/20"
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#173E30] px-4 py-3 font-black text-white transition hover:bg-[#245640] disabled:opacity-60"
          >
            {loading ? "Verifying..." : "OPEN SYSTEM"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized clients only
        </p>
      </div>
    </main>
  );
}
