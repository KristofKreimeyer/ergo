import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireChefin } from "@/lib/auth";
import { setActive } from "./actions";
import { NewUserForm } from "./new-user-form";

export default async function BenutzerPage() {
  const me = await requireChefin();
  const all = await db.select().from(users).orderBy(asc(users.name));
  return (
    <>
      <h1 className="text-xl font-semibold">Benutzer</h1>
      <ul className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 bg-white">
        {all.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
            <span className="font-medium">{u.name}</span>
            <span className="text-sm text-slate-600">{u.email}</span>
            <span className="text-sm text-slate-600">{u.role === "chefin" ? "Chefin" : "Mitarbeiter/in"}</span>
            {!u.active && <span className="text-sm text-red-700">deaktiviert</span>}
            {u.id !== me.id && (
              <form action={setActive} className="ml-auto">
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="active" value={String(!u.active)} />
                <button className="text-sm underline">{u.active ? "Deaktivieren" : "Aktivieren"}</button>
              </form>
            )}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 mb-3 font-semibold">Neuen Benutzer anlegen</h2>
      <NewUserForm />
    </>
  );
}
