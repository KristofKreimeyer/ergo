"use client";

import { useActionState } from "react";
import { saveAppointment } from "./actions";

const input = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-base";

type Defaults = {
  date: string;
  time: string;
  durationMin: number;
  patientName: string;
  note: string;
  userId: string;
  reportWritten: boolean;
};

export function AppointmentForm({
  id,
  defaults,
  people,
}: {
  id: string | null;
  defaults: Defaults;
  people: { id: string; name: string }[] | null;
}) {
  const [error, action, pending] = useActionState(saveAppointment.bind(null, id), null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Datum
        <input name="date" type="date" required defaultValue={defaults.date} className={input} />
      </label>
      <label className="text-sm">Uhrzeit
        <input name="time" type="time" required step={300} defaultValue={defaults.time} className={input} />
      </label>
      <label className="text-sm">Dauer (Minuten)
        <input name="durationMin" type="number" required min={5} max={480} step={5} defaultValue={defaults.durationMin} className={input} />
      </label>
      {people && (
        <label className="text-sm">Mitarbeiter/in
          <select name="userId" defaultValue={defaults.userId} className={input}>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      )}
      <label className="text-sm sm:col-span-2">Patientenname
        <input name="patientName" required maxLength={200} defaultValue={defaults.patientName} className={input} />
      </label>
      <label className="text-sm sm:col-span-2">Notiz (keine Befunde)
        <textarea name="note" rows={2} maxLength={1000} defaultValue={defaults.note} className={input} />
      </label>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input name="reportWritten" type="checkbox" defaultChecked={defaults.reportWritten} className="h-5 w-5" />
        Bericht geschrieben
      </label>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <button disabled={pending} className="rounded bg-teal-700 px-3 py-2 font-medium text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">
        Speichern
      </button>
    </form>
  );
}
