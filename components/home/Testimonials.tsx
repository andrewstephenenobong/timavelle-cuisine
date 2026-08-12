interface Testimonial {
  _id: string;
  clientName: string;
  quote: string;
  eventType?: string;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="bg-emerald-deep px-6 py-24 text-ivory md:px-16">
      <span className="block text-center font-utility text-xs uppercase tracking-[0.3em] text-gold">
        From the Table
      </span>
      <div className="mx-auto mt-10 grid max-w-5xl gap-10 md:grid-cols-2">
        {testimonials.slice(0, 4).map((t) => (
          <div key={t._id}>
            <p className="font-display text-xl italic leading-snug sm:text-2xl">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 font-utility text-sm text-ivory/60">
              {t.clientName}{t.eventType ? ` — ${t.eventType}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}