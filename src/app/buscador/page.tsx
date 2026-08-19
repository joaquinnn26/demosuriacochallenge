import type { Metadata } from "next";
import { AdventureFinder } from "@/components/AdventureFinder";

export const metadata: Metadata = {
  title: "Buscador de aventuras",
  description: "Encuentra experiencias compatibles por tipo de aventura, duración y dificultad."
};

export default function FinderPage() {
  return (
    <main className="pt-16">
      <AdventureFinder />
    </main>
  );
}

