"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireChefin } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().trim().min(1, "Name fehlt."),
  email: z.string().email("E-Mail ist ungültig."),
  password: z.string().min(10, "Das Passwort braucht mindestens 10 Zeichen."),
  role: z.enum(["mitarbeiter", "chefin"]),
});

export async function createUser(_prev: string | null, formData: FormData) {
  await requireChefin();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;
  const { password, email, ...rest } = parsed.data;
  try {
    await db.insert(users).values({
      ...rest,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
    });
  } catch {
    return "Diese E-Mail ist schon vergeben.";
  }
  revalidatePath("/benutzer");
  return null;
}

export async function setActive(formData: FormData) {
  const me = await requireChefin();
  const id = z.string().uuid().parse(formData.get("id"));
  if (id === me.id) return; // sich selbst nicht aussperren
  await db
    .update(users)
    .set({ active: formData.get("active") === "true" })
    .where(eq(users.id, id));
  revalidatePath("/benutzer");
}
