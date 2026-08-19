type Guide = {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  specialties: string[];
  credentials: string;
  experience: string;
  languages: string;
};

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="overflow-hidden rounded-sm bg-white shadow-sm">
      <img src={guide.image} alt={guide.imageAlt} className="h-72 w-full object-cover" loading="lazy" />
      <div className="p-6">
        <p className="eyebrow">{guide.role}</p>
        <h3 className="mt-2 font-display text-3xl font-black uppercase">{guide.name}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {guide.specialties.map((item) => (
            <span key={item} className="rounded-sm bg-fog px-3 py-1 text-xs font-bold uppercase">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-carbon/70">{guide.credentials}</p>
        <p className="mt-2 text-sm leading-6 text-carbon/70">{guide.experience}</p>
        <p className="mt-2 text-sm font-bold text-carbon/70">Idiomas: {guide.languages}</p>
      </div>
    </article>
  );
}
