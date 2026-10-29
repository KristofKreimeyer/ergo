# Ergo Terminkalender

Terminverwaltung für die Ergotherapie-Praxis: eigener Kalender pro Mitarbeiter/in, die Chefin sieht alle, an jedem Termin lässt sich abhaken, ob der Bericht geschrieben ist.

Stack: Next.js (App Router), TypeScript, Tailwind, Postgres mit Drizzle.

## Lokal starten

1. Postgres bereitstellen und `.env.local` nach `.env.example` anlegen (`DATABASE_URL`, `SESSION_SECRET`).
2. `npm install`
3. `npm run db:migrate`
4. Erste Chefin anlegen: `SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… npm run db:seed`
5. `npm run dev`

Weitere Benutzer legt die Chefin unter „Benutzer“ an. Tests: `npm test`, Typen: `npm run typecheck`.

## Stand

- Schritt 2: Login, Rollen (Mitarbeiter/in, Chefin), Benutzerverwaltung. Der Kalender ist noch ein Platzhalter.
