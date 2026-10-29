import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "./schema";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD müssen gesetzt sein.");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  await db
    .insert(users)
    .values({
      name: process.env.SEED_ADMIN_NAME ?? "Chefin",
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: "chefin",
    })
    .onConflictDoNothing();
  await pool.end();
  console.log(`Chefin ${email} angelegt (falls noch nicht vorhanden).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
