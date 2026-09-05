import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import "sweetalert2/dist/sweetalert2.min.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const display = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap"
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Suriaco Challenge | Trekking, montaña y naturaleza",
    template: "%s | Suriaco Challenge"
  },
  description:
    "Salidas guiadas de trekking, montaña, naturaleza y experiencias grupales en Suriaco.",
  openGraph: {
    title: "Suriaco Challenge",
    description:
      "Trekking, montaña, naturaleza y salidas guiadas para grupos.",
    type: "website",
    locale: "es_AR"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
