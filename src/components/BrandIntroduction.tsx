import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BrandIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.brand-intro-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="relative scroll-mt-20 border-t border-[#C9A875]/12 bg-[#090909] py-28 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div
          aria-hidden="true"
          className="brand-intro-reveal mx-auto mb-8 h-12 w-[1px] bg-gradient-to-b from-transparent via-[#C9A875] to-[#C9A875]/20"
        />

        <p className="brand-intro-reveal text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase sm:text-xs">
          MORE THAN A SALON.
        </p>

        <h2 className="brand-intro-reveal mt-6 font-serif text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.12] font-normal tracking-[-0.01em] text-[#F3EEE6]">
          AN EXPRESSION OF YOU.
          <br />
          <span className="text-[#EAD5AD]">ELEVATED BY US.</span>
        </h2>

        <p className="brand-intro-reveal mx-auto mt-8 max-w-2xl text-[15px] leading-[1.8] text-[#AAA39A] sm:text-lg">
          At LUMIÈRE, beautiful hair is never one-size-fits-all. We combine thoughtful
          consultation, exceptional technique, and creative artistry to create looks that
          feel uniquely yours.
        </p>
      </div>
    </section>
  );
}
