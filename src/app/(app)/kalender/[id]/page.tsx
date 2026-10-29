import { notFound } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getAppointment, listActiveUsers } from "@/lib/appointments";
import { isChefin } from "@/lib/permissions";
import { berlinDay, berlinTime } from "@/lib/time";
import { deleteAppointment } from "../actions";
import { AppointmentForm } from "../appointment-form";

export default async function TerminBearbeiten({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const a = await getAppointment(user, id);
  if (!a) notFound();
  const people = isChefin(user) ? await listActiveUsers() : null;
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Termin bearbeiten</h1>
      <AppointmentForm
        id={a.id}
        people={people}
        defaults={{
          date: berlinDay(a.startsAt),
          time: berlinTime(a.startsAt),
          durationMin: a.durationMin,
          patientName: a.patientName,
          note: a.note ?? "",
          userId: a.userId,
          reportWritten: a.reportWritten,
        }}
      />
      <form action={deleteAppointment} className="mt-8">
        <input type="hidden" name="id" value={a.id} />
        <button className="text-sm text-red-700 underline">Termin löschen</button>
      </form>
    </>
  );
}
