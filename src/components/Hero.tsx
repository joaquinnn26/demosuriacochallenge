import { ButtonLink } from "./ButtonLink";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[94svh] overflow-hidden bg-carbon text-fog">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=84"
        alt="Persona contemplando montanas desde un sendero alto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-carbon/58" />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/55 via-carbon/12 to-carbon/64" />

      <div className="section-shell relative flex min-h-[94svh] items-center justify-center pb-28 pt-28 text-center">
        <div className="fade-in mx-auto max-w-4xl">
          <p className="mx-auto inline-flex rounded-full bg-moss px-5 py-2 text-xs font-black uppercase tracking-wide text-fog">
            Agenda de trekking y aventura
          </p>
          <h1 className="mt-6 font-display text-5xl font-black uppercase leading-none md:text-7xl">
            Viví la montaña. Nosotros te guiamos.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-8 text-fog/86 md:text-2xl">
            Salidas de 1 día, viajes con pernocta, nieve, escalada y astronomía con guías profesionales.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/contacto" variant="whatsapp">
              <WhatsAppIcon />
              <span>Consultar por WhatsApp</span>
            </ButtonLink>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[-1px] h-24 bg-white"
        style={{ clipPath: "polygon(0 58%, 24% 32%, 48% 45%, 67% 0, 100% 58%, 100% 100%, 0 100%)" }}
      />
    </section>
  );
}
