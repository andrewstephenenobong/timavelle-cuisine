import LinkButton from '@/components/ui/LinkButton';

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-emerald-deep px-6 text-center">
      <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">
        Timavelle Cuisine — Private Culinary House
      </span>
      <h1 className="max-w-3xl font-display text-5xl font-medium leading-tight text-ivory sm:text-6xl">
        Crafting Flavors.
        <span className="italic text-gold"> Creating Memories.</span>
      </h1>
      <p className="max-w-xl font-body text-lg text-ivory/75">
       At Timavelle Cuisine, we believe every meal is an experience worth remembering. 
       From authentic African delicacies to refined international cuisine, 
       we craft every dish with exceptional flavor, elegant presentation, 
       and genuine hospitality—turning ordinary moments into unforgettable memories.
      </p>
      <LinkButton href="/#reserve" className="mt-4">Book Catering</LinkButton>
    </section>
  );
}
