export const TZ = "Europe/Berlin";

const partsFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function berlinParts(d: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    y: +p.year,
    mo: +p.month,
    d: +p.day,
    h: +p.hour,
    mi: +p.minute,
  };
}

/** Versatz Berlin gegenüber UTC in Minuten zum Zeitpunkt d. */
function offsetMin(d: Date) {
  const p = berlinParts(d);
  return (Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - Math.floor(d.getTime() / 60000) * 60000) / 60000;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-29" und "14:30" (Berliner Ortszeit) -> Date (UTC-Zeitpunkt). */
export function berlinToDate(date: string, time = "00:00"): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const asUtc = Date.UTC(y, mo - 1, d, h, mi);
  let guess = new Date(asUtc - offsetMin(new Date(asUtc)) * 60000);
  guess = new Date(asUtc - offsetMin(guess) * 60000);
  return guess;
}

/** Berliner Kalendertag eines Zeitpunkts als "YYYY-MM-DD". */
export function berlinDay(d: Date): string {
  const p = berlinParts(d);
  return `${p.y}-${pad(p.mo)}-${pad(p.d)}`;
}

export function berlinTime(d: Date): string {
  const p = berlinParts(d);
  return `${pad(p.h)}:${pad(p.mi)}`;
}

export function addDays(day: string, n: number): string {
  const [y, mo, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, mo - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Montag der Woche, in der day liegt. */
export function weekStart(day: string): string {
  const [y, mo, d] = day.split("-").map(Number);
  const dow = (new Date(Date.UTC(y, mo - 1, d)).getUTCDay() + 6) % 7;
  return addDays(day, -dow);
}

export const isDay = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));

const dayLabelFmt = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});
const dayShortFmt = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "numeric",
});

export const dayLabel = (day: string) => dayLabelFmt.format(new Date(day + "T00:00:00Z"));
export const dayShort = (day: string) => dayShortFmt.format(new Date(day + "T00:00:00Z"));
