export const siteConfig = {
  name: "Suriaco Challenge",
  instagramUrl: "https://www.instagram.com/suriacochallenge/",
  email: "suriacochallenge@gmail.com",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000",
  whatsappNumber: "34644138997",
  whatsappMessage:
    "Hola, quiero consultar por una salida de Suriaco Challenge. Me gustaria recibir informacion sobre fechas, dificultad y requisitos."
};

export const navItems = [
  { href: "/#quienes-somos", label: "Quienes somos" },
  { href: "/#experiencias", label: "Experiencias" },
  { href: "/#mapa", label: "Mapa" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#consulta", label: "Consulta" }
];
