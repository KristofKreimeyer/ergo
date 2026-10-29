import { describe, expect, it } from "vitest";
import { addDays, berlinDay, berlinTime, berlinToDate, weekStart } from "./time";

describe("time (Europe/Berlin)", () => {
  it("Sommerzeit: 14:30 Berlin ist 12:30 UTC", () => {
    expect(berlinToDate("2026-07-01", "14:30").toISOString()).toBe("2026-07-01T12:30:00.000Z");
  });
  it("Winterzeit: 14:30 Berlin ist 13:30 UTC", () => {
    expect(berlinToDate("2026-12-01", "14:30").toISOString()).toBe("2026-12-01T13:30:00.000Z");
  });
  it("Umstellung 25.10.2026: 08:00 ist schon Winterzeit", () => {
    expect(berlinToDate("2026-10-25", "08:00").toISOString()).toBe("2026-10-25T07:00:00.000Z");
  });
  it("Hin und zurück", () => {
    const d = berlinToDate("2026-03-29", "10:15");
    expect(berlinDay(d)).toBe("2026-03-29");
    expect(berlinTime(d)).toBe("10:15");
  });
  it("späte Abendzeit gehört zum Berliner Tag", () => {
    expect(berlinDay(new Date("2026-07-01T22:30:00Z"))).toBe("2026-07-02");
  });
  it("Wochenstart ist Montag", () => {
    expect(weekStart("2026-10-29")).toBe("2026-10-26");
    expect(weekStart("2026-11-01")).toBe("2026-10-26");
    expect(weekStart("2026-10-26")).toBe("2026-10-26");
  });
  it("addDays über Monatsgrenze", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
  });
});
