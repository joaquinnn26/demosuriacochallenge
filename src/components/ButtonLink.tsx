import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "accent" | "whatsapp";
  className?: string;
};

const variants = {
  primary:
    "bg-fog text-carbon hover:bg-stone focus-visible:outline-ember",
  secondary:
    "bg-pine text-fog hover:bg-carbon focus-visible:outline-ember",
  ghost:
    "border border-fog/35 text-fog hover:bg-fog hover:text-carbon focus-visible:outline-ember",
  accent:
    "bg-ember text-white hover:bg-fog hover:text-carbon focus-visible:outline-ember",
  whatsapp:
    "!rounded-full border-2 border-[#78ff86] bg-[#25D366] text-white shadow-[0_0_0_4px_rgba(37,211,102,0.18)] hover:bg-[#1ebe5d] focus-visible:outline-[#78ff86]"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
