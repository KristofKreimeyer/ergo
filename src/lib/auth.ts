import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { isChefin } from "./permissions";
import { readSession } from "./session";

export const getCurrentUser = cache(async () => {
  const id = await readSession();
  if (!id) return null;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user?.active ? user : null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireChefin() {
  const user = await requireUser();
  if (!isChefin(user)) redirect("/kalender");
  return user;
}
