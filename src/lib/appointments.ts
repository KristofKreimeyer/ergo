import "server-only";
import { and, asc, eq, gte, lt, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { appointments, users, type User } from "@/db/schema";
import { isChefin } from "./permissions";

export type AppointmentRow = {
  id: string;
  userId: string;
  userName: string;
  startsAt: Date;
  durationMin: number;
  patientName: string;
  note: string | null;
  reportWritten: boolean;
};

const columns = {
  id: appointments.id,
  userId: appointments.userId,
  userName: users.name,
  startsAt: appointments.startsAt,
  durationMin: appointments.durationMin,
  patientName: appointments.patientName,
  note: appointments.note,
  reportWritten: appointments.reportWritten,
};

/** Mitarbeitende bekommen immer nur eigene Termine; die Chefin optional gefiltert nach Person. */
function scope(actor: User, personId?: string): SQL | undefined {
  if (!isChefin(actor)) return eq(appointments.userId, actor.id);
  return personId ? eq(appointments.userId, personId) : undefined;
}

export function listInRange(actor: User, from: Date, to: Date, personId?: string) {
  return db
    .select(columns)
    .from(appointments)
    .innerJoin(users, eq(users.id, appointments.userId))
    .where(and(gte(appointments.startsAt, from), lt(appointments.startsAt, to), scope(actor, personId)))
    .orderBy(asc(appointments.startsAt));
}

export function listOpenReports(actor: User, before: Date, personId?: string) {
  return db
    .select(columns)
    .from(appointments)
    .innerJoin(users, eq(users.id, appointments.userId))
    .where(
      and(
        lt(appointments.startsAt, before),
        eq(appointments.reportWritten, false),
        scope(actor, personId),
      ),
    )
    .orderBy(asc(appointments.startsAt));
}

export async function getAppointment(actor: User, id: string) {
  const [row] = await db
    .select(columns)
    .from(appointments)
    .innerJoin(users, eq(users.id, appointments.userId))
    .where(and(eq(appointments.id, id), scope(actor)));
  return row ?? null;
}

export function listActiveUsers() {
  return db.select({ id: users.id, name: users.name }).from(users).where(eq(users.active, true)).orderBy(asc(users.name));
}
