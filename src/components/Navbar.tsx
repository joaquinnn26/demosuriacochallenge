"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, siteConfig } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

function whatsAppHref() {
  const encoded = encodeURIComponent(siteConfig.whatsappMessage);
  if (!siteConfig.whatsappNumber) return `/contacto?mensaje=${encoded}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-fog/10 bg-carbon/78 text-fog backdrop-blur-xl">
      <nav className="section-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="focus-ring font-display text-base font-black uppercase tracking-wide"
          onClick={() => setOpen(false)}
        >
          Suriaco<span className="text-moss"> Challenge</span>
        </Link>

        <button
          type="button"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-fog/25 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-fog transition ${open ? "top-2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 bg-fog transition ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-fog transition ${open ? "top-2 -rotate-45" : "top-4"}`}
            />
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring text-xs font-bold uppercase tracking-wide transition hover:text-moss ${
                pathname === item.href ? "text-moss" : "text-fog"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsAppHref()}
            className="focus-ring inline-flex items-center gap-2 rounded-full border-2 border-[#78ff86] bg-[#25D366] px-4 py-3 text-xs font-black uppercase tracking-wide text-white shadow-[0_0_0_3px_rgba(120,255,134,0.18)] transition hover:bg-[#1ebe5d]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-fog/10 bg-carbon md:hidden">
          <div className="section-shell grid gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-wide"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsAppHref()}
              className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#78ff86] bg-[#25D366] px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_0_0_3px_rgba(120,255,134,0.18)]"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

