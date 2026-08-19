import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Criterio de trabajo",
  description: "Como se planifican las salidas de Suriaco Challenge."
};

export default function TestimonialsPage() {
  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Criterio de trabajo"
            title="Que cuidamos en cada salida"
            body="Este espacio comunica criterios de preparacion hasta sumar testimonios reales verificados."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-20">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </main>
  );
}
