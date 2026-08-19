type Testimonial = {
  quote: string;
  name: string;
  activity: string;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="rounded-sm bg-white p-6 shadow-sm">
      <p className="font-display text-3xl font-black text-ember" aria-hidden="true">
        *
      </p>
      <blockquote className="mt-4 text-lg font-semibold leading-7 text-carbon">
        "{testimonial.quote}"
      </blockquote>
      <p className="mt-5 font-bold">{testimonial.name}</p>
      <p className="text-sm text-carbon/55">{testimonial.activity}</p>
    </article>
  );
}
