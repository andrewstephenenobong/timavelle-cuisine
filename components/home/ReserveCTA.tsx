import EnquiryForm from '@/components/enquiry/EnquiryForm';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function ReserveCTA() {
  return (
    <section id="reserve" className="tv-reserve">
      <div><div className="tv-hero__eyebrow">05 / The next step</div><h2>Let&rsquo;s make<br /><em>the room yours.</em></h2><p>
        Tell us about your event, or reach out directly on WhatsApp — either way, we&rsquo;ll follow up quickly.
      </p></div>

      <div className="tv-reserve__card">
        <EnquiryForm />
        <span className="block py-4 text-center font-utility text-xs uppercase tracking-widest text-stone">or</span>
        <WhatsAppButton />
      </div>
    </section>
  );
}
