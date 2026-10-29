"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

const input = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-base";

export function NewUserForm() {
  const [error, action, pending] = useActionState(createUser, null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Name<input name="name" required className={input} /></label>
      <label className="text-sm">E-Mail<input name="email" type="email" required className={input} /></label>
      <label className="text-sm">Startpasswort<input name="password" type="password" minLength={10} required autoComplete="new-password" className={input} /></label>
      <label className="text-sm">Rolle
        <select name="role" className={input}>
          <option value="mitarbeiter">Mitarbeiter/in</option>
          <option value="chefin">Chefin</option>
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <button disabled={pending} className="rounded bg-teal-700 px-3 py-2 font-medium text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">
        Benutzer anlegen
      </button>
    </form>
  );
}
