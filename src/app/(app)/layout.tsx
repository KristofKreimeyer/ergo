import Link from "next/link";
import { logout } from "@/app/login/actions";
import { requireUser } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/kalender" className="font-semibold">Kalender</Link>
          <Link href="/berichte">Berichte offen</Link>
          {canManageUsers(user) && <Link href="/benutzer">Benutzer</Link>}
          <span className="ml-auto text-sm text-slate-600">{user.name}</span>
          <form action={logout}>
            <button className="text-sm underline">Abmelden</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </>
  );
}
