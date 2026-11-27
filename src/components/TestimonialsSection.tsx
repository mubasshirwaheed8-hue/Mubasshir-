import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SAMPLE_TESTIMONIALS } from '../data/salonData';

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 20,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Client Impressions"
      className="relative border-t border-[#C9A875]/12 bg-[#11100F] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 flex flex-col justify-between gap-4 border-b border-[#C9A875]/15 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase">
              CLIENT PERSPECTIVES
            </p>
            <h2 className="mt-4 font-serif text-[clamp(1.85rem,3.4vw,3rem)] leading-[1.12] font-normal text-[#F3EEE6]">
              WORDS THAT STAY WITH US.
            </h2>
          </div>

          <p className="text-xs tracking-[0.12em] text-[#AAA39A]">
            Illustrative sample testimonials for studio demonstration
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {SAMPLE_TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="testimonial-card flex flex-col justify-between border border-[#C9A875]/15 bg-[#090909]/70 p-7 sm:p-9"
            >
              <div>
                <span
                  aria-hidden="true"
                  className="block font-serif text-5xl leading-none text-[#C9A875]/65 select-none"
                >
                  “
                </span>
                <blockquote className="mt-3 font-serif text-lg leading-[1.6] font-normal text-[#F3EEE6]/95 sm:text-xl">
                  {item.quote}
                </blockquote>
              </div>

              <footer className="mt-8 border-t border-[#C9A875]/12 pt-5">
                <p className="text-sm font-medium tracking-[0.06em] text-[#EAD5AD]">
                  {item.author}
                </p>
                <p className="mt-1 text-xs text-[#AAA39A]">{item.service}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
