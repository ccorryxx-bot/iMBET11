import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface PromoBannerSlide {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

// TODO: replace with real banner image URLs once ready.
// Recommended source size: 1200x450px (~2.67:1 ratio), WebP, <150KB.
const defaultSlides: PromoBannerSlide[] = [
  { id: 'b1', image: 'https://picsum.photos/seed/promo1/1200/450', alt: 'Welcome Bonus' },
  { id: 'b2', image: 'https://picsum.photos/seed/promo2/1200/450', alt: 'Deposit Promotion' },
  { id: 'b3', image: 'https://picsum.photos/seed/promo3/1200/450', alt: 'Agent Network' },
];

const AUTOPLAY_MS = 4500;

interface PromoBannerProps {
  slides?: PromoBannerSlide[];
}

export default function PromoBanner({ slides = defaultSlides }: PromoBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => setIndex(i), []);
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, paused, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index];

  return (
    <div
      className="relative w-full aspect-[8/3] rounded-2xl overflow-hidden bg-surface"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.a
          key={active.id}
          href={active.link || '#'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 block"
        >
          <img
            src={active.image}
            alt={active.alt}
            className="h-full w-full object-cover"
          />
        </motion.a>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-text-dark/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-accent-gold' : 'w-1.5 bg-text-primary/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
