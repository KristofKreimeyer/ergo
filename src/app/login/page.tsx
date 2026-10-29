"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Anmelden</h1>
      <form action={action} className="space-y-4">
        <label className="block text-sm">
          E-Mail
          <input name="email" type="email" autoComplete="username" required
            className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-base" />
        </label>
        <label className="block text-sm">
          Passwort
          <input name="password" type="password" autoComplete="current-password" required
            className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-base" />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={pending}
          className="w-full rounded bg-teal-700 px-3 py-2 font-medium text-white disabled:opacity-60">
          {pending ? "Einen Moment …" : "Anmelden"}
        </button>
      </form>
    </main>
  );
}
