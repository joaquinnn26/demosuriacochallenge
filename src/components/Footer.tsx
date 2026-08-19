import Link from "next/link";
import { navItems, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-carbon py-12 text-fog">
      <div className="section-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-2xl font-black uppercase">{siteConfig.name}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-fog/70">
            Salidas guiadas de trekking, montana, naturaleza y experiencias grupales en Suriaco.
          </p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-moss">Landing</p>
          <div className="mt-4 grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="focus-ring text-sm text-fog/75 hover:text-fog">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-moss">Contacto</p>
          <p className="mt-4 text-sm text-fog/75">WhatsApp: consultar desde el formulario</p>
          <p className="mt-2 text-sm text-fog/75">Email: disponible a pedido</p>
          <p className="mt-6 text-xs uppercase tracking-wide text-fog/45">
            Fechas, cupos y valores se confirman antes de reservar.
          </p>
        </div>
      </div>
    </footer>
  );
}
