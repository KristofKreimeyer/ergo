import { describe, expect, it } from "vitest";
import { canAccessAppointment, canManageUsers } from "./permissions";

const chefin = { id: "c", role: "chefin" as const };
const anna = { id: "a", role: "mitarbeiter" as const };

describe("permissions", () => {
  it("Mitarbeitende sehen nur eigene Termine", () => {
    expect(canAccessAppointment(anna, "a")).toBe(true);
    expect(canAccessAppointment(anna, "b")).toBe(false);
  });
  it("Chefin sieht alle Termine", () => {
    expect(canAccessAppointment(chefin, "a")).toBe(true);
    expect(canAccessAppointment(chefin, "b")).toBe(true);
  });
  it("nur die Chefin verwaltet Benutzer", () => {
    expect(canManageUsers(chefin)).toBe(true);
    expect(canManageUsers(anna)).toBe(false);
  });
});
