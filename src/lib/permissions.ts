import type { Role } from "@/db/schema";

type Actor = { id: string; role: Role };

export const isChefin = (actor: Actor) => actor.role === "chefin";

/** Mitarbeitende sehen und ändern nur eigene Termine, die Chefin alle. */
export function canAccessAppointment(actor: Actor, appointmentUserId: string) {
  return isChefin(actor) || actor.id === appointmentUserId;
}

export const canManageUsers = isChefin;
