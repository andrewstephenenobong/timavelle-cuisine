import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

const PHONE_NUMBER = '2349083317591';

export default function WhatsAppButton({
  message = "Hi Timavelle Cuisine! I'd like to enquire about an event.",
  className = '',
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-emerald px-6 py-3 font-utility text-sm font-medium text-emerald transition-colors hover:bg-emerald hover:text-ivory ${className}`}
    >
      <MessageCircle size={18} />
      Chat on WhatsApp
    </a>
  );
}