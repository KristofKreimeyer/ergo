import { requireUser } from "@/lib/auth";
import { listActiveUsers } from "@/lib/appointments";
import { isChefin } from "@/lib/permissions";
import { berlinDay, isDay } from "@/lib/time";
import { AppointmentForm } from "../appointment-form";

export default async function NeuerTermin({
  searchParams,
}: {
  searchParams: Promise<{ datum?: string }>;
}) {
  const user = await requireUser();
  const { datum } = await searchParams;
  const people = isChefin(user) ? await listActiveUsers() : null;
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Neuer Termin</h1>
      <AppointmentForm
        id={null}
        people={people}
        defaults={{
          date: isDay(datum) ? datum : berlinDay(new Date()),
          time: "09:00",
          durationMin: 45,
          patientName: "",
          note: "",
          userId: user.id,
          reportWritten: false,
        }}
      />
    </>
  );
}
