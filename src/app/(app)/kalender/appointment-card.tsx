import Link from "next/link";
import type { AppointmentRow } from "@/lib/appointments";
import { berlinTime } from "@/lib/time";
import { toggleReport } from "./actions";

export function AppointmentCard({
  a,
  showPerson,
  now,
}: {
  a: AppointmentRow;
  showPerson: boolean;
  now: Date;
}) {
  const end = new Date(a.startsAt.getTime() + a.durationMin * 60000);
  const reportOpen = !a.reportWritten && end < now;
  return (
    <li
      className={`rounded border bg-white p-3 text-sm ${
        reportOpen ? "border-amber-400 bg-amber-50" : "border-slate-200"
      }`}
    >
      <Link href={`/kalender/${a.id}`} className="block">
        <span className="font-medium">
          {berlinTime(a.startsAt)}–{berlinTime(end)}
        </span>{" "}
        <span>{a.patientName}</span>
        {showPerson && <span className="block text-slate-600">{a.userName}</span>}
        {a.note && <span className="block text-slate-600">{a.note}</span>}
      </Link>
      <form action={toggleReport} className="mt-2">
        <input type="hidden" name="id" value={a.id} />
        <button
          className={`rounded border px-2 py-1 text-xs ${
            a.reportWritten
              ? "border-teal-700 bg-teal-50 text-teal-800"
              : reportOpen
                ? "border-amber-600 text-amber-900"
                : "border-slate-300 text-slate-700"
          }`}
          aria-pressed={a.reportWritten}
        >
          {a.reportWritten ? "✓ Bericht geschrieben" : reportOpen ? "Bericht offen" : "Bericht noch nicht geschrieben"}
        </button>
      </form>
    </li>
  );
}
