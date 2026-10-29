"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/session";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

// Vergleich auch bei unbekannter E-Mail, damit die Antwortzeit nichts verrät.
const DUMMY_HASH = bcrypt.hashSync("dummy", 12);

export async function login(_prev: string | null, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return "Bitte E-Mail und Passwort eingeben.";
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()));
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.active || !ok) return "E-Mail oder Passwort ist falsch.";
  await createSession(user.id);
  redirect("/kalender");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
