import { requireUser } from "@/lib/auth";
import { listOpenReports } from "@/lib/appointments";
import { isChefin } from "@/lib/permissions";
import { berlinDay, dayLabel } from "@/lib/time";
import { AppointmentCard } from "../kalender/appointment-card";

export default async function BerichtePage() {
  const user = await requireUser();
  const now = new Date();
  const rows = await listOpenReports(user, now);
  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const d = berlinDay(r.startsAt);
    groups.set(d, [...(groups.get(d) ?? []), r]);
  }
  return (
    <>
      <h1 className="text-xl font-semibold">Berichte offen</h1>
      <p className="mt-1 text-sm text-slate-600">Vergangene Termine, zu denen noch kein Bericht abgehakt ist.</p>
      {rows.length === 0 && <p className="mt-6">Alles erledigt. 🎉</p>}
      <div className="mt-4 space-y-4">
        {[...groups].map(([d, list]) => (
          <section key={d}>
            <h2 className="mb-2 text-sm font-semibold">{dayLabel(d)}</h2>
            <ul className="space-y-2">
              {list.map((a) => (
                <AppointmentCard key={a.id} a={a} showPerson={isChefin(user)} now={now} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
