import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Sostenibilidad",
  description: "Principios ambientales y buenas prácticas para actividades de montaña."
};

const principles = [
  ["Reducir residuos", "Cada participante recibe indicaciones para volver con sus residuos y evitar descartes durante la actividad."],
  ["Respetar senderos", "Se prioriza circular por huellas existentes para reducir impacto sobre suelo, flora y zonas sensibles."],
  ["Cuidar el entorno", "La observación de flora, fauna y paisaje se trabaja con distancia, silencio y criterio de bajo impacto."],
  ["Grupos responsables", "Los cupos se ajustan según dificultad, destino y capacidad de acompañamiento del equipo."],
  ["Preparación previa", "Antes de salir se comunica equipo necesario, clima esperado, agua, abrigo y pautas de convivencia."],
  ["Comunidad local", "Las propuestas buscan valorar el territorio y promover una relación respetuosa con Suriaco."]
];

export default function SustainabilityPage() {
  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Sostenibilidad"
            title="Dejar la montaña como la encontramos"
            body="Principios de bajo impacto aplicados a la planificación y ejecución de las salidas."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-20">
        <div className="section-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {principles.map(([principle, body]) => (
            <article key={principle} className="rounded-sm bg-white p-6 shadow-sm">
              <p className="font-display text-3xl font-black text-moss">*</p>
              <h2 className="mt-3 font-display text-2xl font-black uppercase">{principle}</h2>
              <p className="mt-3 text-sm leading-6 text-carbon/68">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
