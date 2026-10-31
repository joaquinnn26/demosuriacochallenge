import type { Metadata } from "next";
import Link from "next/link";
import { AdminActivitiesPanel } from "@/components/AdminActivitiesPanel";

export const metadata: Metadata = {
  title: "Panel de actividades",
  description: "Administración de actividades de Suriaco Challenge."
};

export default function AdminActivitiesPage() {
  return (
    <main className="min-h-screen bg-fog pb-20">
      <header className="border-b border-white/10 bg-carbon text-white">
        <div className="section-shell flex min-h-20 items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-moss">Suriaco Challenge</p>
            <p className="mt-1 font-display text-xl font-black uppercase">Panel de actividades</p>
          </div>
          <Link href="/" className="focus-ring rounded-full border border-white/25 px-4 py-2 text-xs font-black uppercase tracking-wide transition hover:border-moss hover:text-moss">
            Ver sitio público ↗
          </Link>
        </div>
      </header>
      <section className="section-shell pt-8">
        <h1 className="sr-only">Administrar actividades</h1>
        <AdminActivitiesPanel />
      </section>
    </main>
  );
}
