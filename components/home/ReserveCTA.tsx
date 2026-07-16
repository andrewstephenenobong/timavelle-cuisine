import Button from '@/components/ui/Button';

export default function ReserveCTA() {
  return (
    <section id="reserve" className="bg-ivory px-6 py-24 text-center md:px-16">
      <h2 className="font-display text-4xl font-medium text-ink">Set your table.</h2>
      <p className="mx-auto mt-4 max-w-md font-body text-stone">
        Tell us the shape of the evening, and we&rsquo;ll follow up within one business day.
      </p>
      <Button className="mt-8">Send a Reservation Request</Button>
    </section>
  );
}
