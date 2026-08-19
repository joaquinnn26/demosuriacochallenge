type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, body, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={`mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl ${
          light ? "text-fog" : "text-carbon"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p className={`mt-5 text-lg leading-8 ${light ? "text-fog/72" : "text-carbon/68"}`}>
          {body}
        </p>
      ) : null}
    </div>
  );
}
