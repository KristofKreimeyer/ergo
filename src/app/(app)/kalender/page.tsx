import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listActiveUsers, listInRange, type AppointmentRow } from "@/lib/appointments";
import { isChefin } from "@/lib/permissions";
import { addDays, berlinDay, berlinToDate, dayLabel, dayShort, isDay, weekStart } from "@/lib/time";
import { AppointmentCard } from "./appointment-card";

type Params = { datum?: string; ansicht?: string; person?: string };

export default async function KalenderPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const now = new Date();
  const today = berlinDay(now);
  const day = isDay(sp.datum) ? sp.datum : today;
  const week = sp.ansicht !== "tag";
  const chefin = isChefin(user);
  const people = chefin ? await listActiveUsers() : [];
  const person = chefin && people.some((p) => p.id === sp.person) ? sp.person : undefined;

  const first = week ? weekStart(day) : day;
  const days = Array.from({ length: week ? 7 : 1 }, (_, i) => addDays(first, i));
  const rows = await listInRange(user, berlinToDate(first), berlinToDate(addDays(first, days.length)), person);
  const byDay = new Map<string, AppointmentRow[]>(days.map((d) => [d, []]));
  for (const r of rows) byDay.get(berlinDay(r.startsAt))?.push(r);

  const qs = (over: Params) => {
    const q = new URLSearchParams();
    const v = { datum: day, ansicht: week ? "woche" : "tag", person, ...over };
    for (const [k, val] of Object.entries(v)) if (val) q.set(k, val);
    return `/kalender?${q}`;
  };
  const step = week ? 7 : 1;
  const link = "rounded border border-slate-300 bg-white px-3 py-1.5 text-sm";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-xl font-semibold">
          {chefin && !person ? "Alle Termine" : chefin ? "Termine" : "Meine Termine"}
        </h1>
        <Link href={`/kalender/neu?datum=${day}`} className="rounded bg-teal-700 px-3 py-1.5 text-sm font-medium text-white">
          Neuer Termin
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href={qs({ datum: addDays(day, -step) })} className={link} aria-label="zurück">←</Link>
        <Link href={qs({ datum: today })} className={link}>Heute</Link>
        <Link href={qs({ datum: addDays(day, step) })} className={link} aria-label="weiter">→</Link>
        <Link href={qs({ ansicht: week ? "tag" : "woche" })} className={link}>
          {week ? "Tagesansicht" : "Wochenansicht"}
        </Link>
        {chefin && (
          <form className="ml-auto flex items-center gap-2">
            <input type="hidden" name="datum" value={day} />
            <input type="hidden" name="ansicht" value={week ? "woche" : "tag"} />
            <select name="person" defaultValue={person ?? ""} className={link} aria-label="Person">
              <option value="">Alle</option>
              {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button className={link}>Anzeigen</button>
          </form>
        )}
      </div>

      <div className={`mt-4 grid gap-4 ${week ? "md:grid-cols-7 md:gap-2" : ""}`}>
        {days.map((d) => (
          <section key={d} className={d === today ? "rounded bg-teal-50/60 md:p-1" : ""}>
            <h2 className="mb-2 text-sm font-semibold">
              <span className="md:hidden">{dayLabel(d)}</span>
              <span className="hidden md:inline">{week ? dayShort(d) : dayLabel(d)}</span>
            </h2>
            {byDay.get(d)!.length ? (
              <ul className="space-y-2">
                {byDay.get(d)!.map((a) => (
                  <AppointmentCard key={a.id} a={a} showPerson={chefin && !person} now={now} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Keine Termine</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
