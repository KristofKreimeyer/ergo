import { requireUser } from "@/lib/auth";
import { isChefin } from "@/lib/permissions";

export default async function KalenderPage() {
  const user = await requireUser();
  return (
    <>
      <h1 className="text-xl font-semibold">
        {isChefin(user) ? "Alle Termine" : "Meine Termine"}
      </h1>
      <p className="mt-2 text-slate-600">Der Kalender folgt in Schritt 3.</p>
    </>
  );
}
