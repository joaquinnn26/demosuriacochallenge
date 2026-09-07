import type { Metadata } from "next";
import { AdminActivitiesPanel } from "@/components/AdminActivitiesPanel";

export const metadata: Metadata = {
  title: "Panel de actividades",
  description: "Administración de actividades de Suriaco Challenge."
};

export default function AdminActivitiesPage() {
  return (
    <main className="bg-fog pb-20 pt-24">
      <section className="section-shell">
        <h1 className="sr-only">Administrar actividades</h1>
        <AdminActivitiesPanel />
      </section>
    </main>
  );
}
