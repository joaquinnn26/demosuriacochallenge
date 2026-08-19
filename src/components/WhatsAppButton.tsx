import { siteConfig } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppButton() {
  const encoded = encodeURIComponent(siteConfig.whatsappMessage);
  const href = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`
    : `/contacto?mensaje=${encoded}`;

  return (
    <a
      href={href}
      className="focus-ring fixed bottom-4 right-4 z-50 inline-flex min-h-12 max-w-[calc(100vw-32px)] items-center justify-center gap-2 rounded-full border-2 border-[#78ff86] bg-[#25D366] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_0_5px_rgba(120,255,134,0.22),0_20px_48px_rgba(16,19,15,0.28)] transition hover:bg-[#1ebe5d] sm:bottom-6 sm:right-6"
      aria-label="Consultar por WhatsApp"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}
