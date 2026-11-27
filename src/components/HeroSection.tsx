import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { IMAGES } from '../data/salonData';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onDiscoverClick: () => void;
}

export function HeroSection({ onDiscoverClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 26,
        opacity: 0,
        duration: 1.05,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
      });

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
      }

      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[#090909] pt-24 pb-12 sm:pb-16 lg:pb-20"
    >
      {/* Background Cinematic Photography */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 h-[112%] w-full will-change-transform"
      >
        <img
          src={IMAGES.heroBrunette}
          alt="Model with long glossy dark brunette hair in warm champagne rim light"
          fetchPriority="high"
          loading="eager"
          referrerPolicy="no-referrer"
          className="animate-hero-zoom h-full w-full object-cover object-[65%_16%] sm:object-[60%_18%]"
        />
      </div>

      {/* Measured Contrast Scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/45 to-[#090909]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090909]/88 via-[#090909]/48 to-transparent"
      />

      {/* Editorial Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 sm:px-8 lg:px-12"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="hero-stagger mb-5 text-[11px] font-medium tracking-[0.28em] text-[#EAD5AD] uppercase sm:text-xs">
              A LUXURY HAIR EXPERIENCE · EST. 2012
            </p>

            <h1 className="hero-stagger font-serif text-[clamp(2.5rem,5.8vw,5.25rem)] leading-[1.02] font-normal tracking-[-0.015em] text-[#F3EEE6]">
              WHERE BEAUTY
              <br />
              BECOMES <span className="text-[#C9A875] italic">ART.</span>
            </h1>

            <p className="hero-stagger mt-6 max-w-lg text-[15px] leading-relaxed text-[#F3EEE6]/85 sm:text-base">
              Thoughtful styling. Exceptional craft. A considered approach to hair that feels
              unmistakably you.
            </p>

            <div className="hero-stagger mt-9 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onDiscoverClick}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center border border-[#C9A875] bg-[#C9A875]/12 px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-[#EAD5AD] uppercase whitespace-nowrap backdrop-blur-sm transition-all duration-200 hover:bg-[#C9A875] hover:text-[#090909]"
              >
                DISCOVER THE EXPERIENCE
              </button>
            </div>
          </div>

          {/* Minimal Scroll Cue */}
          <a
            href="#cinematic-experience"
            onClick={(e) => {
              e.preventDefault();
              onDiscoverClick();
            }}
            className="hero-stagger group hidden items-center gap-4 self-end pb-1 text-right focus-visible:outline-[#C9A875] sm:inline-flex"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium tracking-[0.28em] text-[#EAD5AD]/85 uppercase transition-colors group-hover:text-[#EAD5AD]">
                SCROLL TO EXPLORE
              </span>
              <span className="mt-1 text-[11px] text-[#AAA39A]">
                Continuous Film Sequence
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span
                ref={lineRef}
                aria-hidden="true"
                className="block h-10 w-[1px] bg-gradient-to-b from-transparent via-[#C9A875] to-[#EAD5AD]"
              />
              <ArrowDown
                className="mt-1 h-3.5 w-3.5 text-[#C9A875] transition-transform duration-300 group-hover:translate-y-1"
                strokeWidth={1.5}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
