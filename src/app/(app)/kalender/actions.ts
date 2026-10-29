"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { appointments, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { canAccessAppointment, isChefin } from "@/lib/permissions";
import { berlinDay, berlinToDate } from "@/lib/time";

const formSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum fehlt."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Uhrzeit fehlt."),
  durationMin: z.coerce.number().int().min(5, "Dauer ist zu kurz.").max(480, "Dauer ist zu lang."),
  patientName: z.string().trim().min(1, "Patientenname fehlt.").max(200),
  note: z.string().trim().max(1000).optional(),
  userId: z.string().uuid().optional(),
});

async function owner(actor: { id: string; role: "mitarbeiter" | "chefin" }, requested?: string) {
  if (!isChefin(actor) || !requested) return actor.id;
  const [u] = await db.select({ id: users.id }).from(users).where(and(eq(users.id, requested), eq(users.active, true)));
  return u?.id ?? null;
}

export async function saveAppointment(id: string | null, _prev: string | null, formData: FormData) {
  const actor = await requireUser();
  const parsed = formSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;
  const { date, time, userId, note, ...rest } = parsed.data;
  const startsAt = berlinToDate(date, time);
  const ownerId = await owner(actor, userId);
  if (!ownerId) return "Mitarbeiter/in nicht gefunden.";
  const report = formData.get("reportWritten") === "on";

  if (id) {
    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
    if (!existing || !canAccessAppointment(actor, existing.userId)) return "Termin nicht gefunden.";
    await db
      .update(appointments)
      .set({
        ...rest,
        note: note || null,
        startsAt,
        userId: ownerId,
        updatedAt: new Date(),
        ...(report !== existing.reportWritten && reportFields(report, actor.id)),
      })
      .where(eq(appointments.id, id));
  } else {
    await db.insert(appointments).values({
      ...rest,
      note: note || null,
      startsAt,
      userId: ownerId,
      createdBy: actor.id,
      ...(report && reportFields(true, actor.id)),
    });
  }
  revalidatePath("/kalender");
  revalidatePath("/berichte");
  redirect(`/kalender?datum=${berlinDay(startsAt)}`);
}

function reportFields(written: boolean, actorId: string) {
  return {
    reportWritten: written,
    reportWrittenAt: written ? new Date() : null,
    reportWrittenBy: written ? actorId : null,
  };
}

export async function toggleReport(formData: FormData) {
  const actor = await requireUser();
  const id = z.string().uuid().parse(formData.get("id"));
  const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!existing || !canAccessAppointment(actor, existing.userId)) return;
  await db
    .update(appointments)
    .set({ ...reportFields(!existing.reportWritten, actor.id), updatedAt: new Date() })
    .where(eq(appointments.id, id));
  revalidatePath("/kalender");
  revalidatePath("/berichte");
}

export async function deleteAppointment(formData: FormData) {
  const actor = await requireUser();
  const id = z.string().uuid().parse(formData.get("id"));
  const [existing] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!existing || !canAccessAppointment(actor, existing.userId)) redirect("/kalender");
  await db.delete(appointments).where(eq(appointments.id, id));
  revalidatePath("/kalender");
  revalidatePath("/berichte");
  redirect(`/kalender?datum=${berlinDay(existing.startsAt)}`);
}
