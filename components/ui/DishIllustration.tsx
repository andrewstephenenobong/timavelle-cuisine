type Variant = 'plate' | 'bowl' | 'board';

export default function DishIllustration({ variant = 'plate' }: { variant?: Variant }) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br from-emerald/10 via-ivory to-gold/10">
      <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 text-emerald-deep">
        {variant === 'plate' && (
          <>
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </>
        )}
        {variant === 'bowl' && (
          <path d="M45 105c0 28 25 42 55 42s55-14 55-42" fill="none" stroke="currentColor" strokeWidth="1.8" />
        )}
        {variant === 'board' && (
          <rect x="40" y="85" width="120" height="48" rx="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
        )}
      </svg>
    </div>
  );
}
