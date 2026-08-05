import EnquiryForm from '@/components/enquiry/EnquiryForm';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function ReserveCTA() {
  return (
    <section id="reserve" className="bg-ivory px-6 py-24 text-center md:px-16">
      <h2 className="font-display text-4xl font-medium text-ink">Start an Enquiry.</h2>
      <p className="mx-auto mt-4 max-w-md font-body text-stone">
        Tell us about your event, or reach out directly on WhatsApp — either way, we&rsquo;ll follow up quickly.
      </p>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-6">
        <EnquiryForm />
        <span className="font-utility text-xs uppercase tracking-widest text-stone/60">or</span>
        <WhatsAppButton />
      </div>
    </section>
  );
}
