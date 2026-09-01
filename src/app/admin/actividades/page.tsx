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
        <div className="mb-8">
          <p className="eyebrow">Panel administrativo</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
            Actividades Suriaco Challenge
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-carbon/68">
            Cargá, editá, duplicá, publicá, archivá o eliminá actividades. Los cambios guardados se leen desde la web pública mediante la API interna.
          </p>
        </div>
        <AdminActivitiesPanel />
      </section>
    </main>
  );
}
