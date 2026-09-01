import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Consulta por salidas guiadas de Suriaco Challenge."
};

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Contacto"
            title="Hablemos de tu próxima salida"
            body="Contanos qué actividad te interesa y te respondemos con fechas, dificultad, requisitos y disponibilidad."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-sm bg-white p-7 shadow-sm">
            <h2 className="font-display text-3xl font-black uppercase">Canales</h2>
            <dl className="mt-6 grid gap-4">
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-carbon/50">WhatsApp</dt>
                <dd className="mt-1 font-bold">Consulta desde el botón de contacto</dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-carbon/50">Email</dt>
                <dd className="mt-1 font-bold">Disponible a pedido</dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-carbon/50">Zonas</dt>
                <dd className="mt-1 font-bold">Madrid, España, Europa-África, Sudamérica y Argentina</dd>
              </div>
            </dl>
          </div>

          <form className="rounded-sm bg-white p-7 shadow-sm">
            <h2 className="font-display text-3xl font-black uppercase">Consulta rápida</h2>
            <p className="mt-3 text-carbon/65">
              Incluí fecha estimada, cantidad de personas y nivel de experiencia para recibir una recomendación más precisa.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold">Nombre</span>
                <input className="focus-ring rounded-xl border border-carbon/15 bg-fog px-4 py-3" name="name" placeholder="Tu nombre" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold">Email o teléfono</span>
                <input className="focus-ring rounded-xl border border-carbon/15 bg-fog px-4 py-3" name="contact" placeholder="Cómo te contactamos" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold">Actividad de interés</span>
                <select className="focus-ring rounded-xl border border-carbon/15 bg-fog px-4 py-3" name="experience" defaultValue="">
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  <option>Actividad de 1 día</option>
                  <option>Actividad con pernocta</option>
                  <option>Trekking</option>
                  <option>Invernales / raquetas / alpinismo</option>
                  <option>Escalada</option>
                  <option>Astronomía en picos de montaña</option>
                  <option>Viaje Argentina 2027</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold">Mensaje</span>
                <textarea className="focus-ring min-h-36 rounded-xl border border-carbon/15 bg-fog px-4 py-3" name="message" placeholder="Contanos qué estás buscando" />
              </label>
              <button
                type="button"
                className="focus-ring rounded-full bg-pine px-6 py-4 text-sm font-black uppercase tracking-wide text-fog transition hover:bg-carbon"
              >
                Enviar consulta
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
