import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/salonData';
import { MediaFrame } from './MediaFrame';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onBookConsultation: () => void;
}

const STUDIO_STATS = [
  { value: '12+', label: 'YEARS OF ARTISTRY' },
  { value: '1:1', label: 'PERSONAL ATTENTION' },
  { value: '100%', label: 'INDIVIDUAL EXPERIENCE' },
];

export function AboutSection({ onBookConsultation }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (imageWrapRef.current) {
        gsap.from(imageWrapRef.current, {
          opacity: 0,
          scale: 1.03,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }

      gsap.from('.about-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
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

  useEffect(() => {
    if (!isStoryOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsStoryOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isStoryOpen]);

  return (
    <>
      <section
        id="the-studio"
        ref={sectionRef}
        className="relative scroll-mt-20 border-t border-[#C9A875]/12 bg-[#11100F]"
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch lg:grid-cols-12">
          {/* Left: Luxury Salon Craft Photograph */}
          <div
            ref={imageWrapRef}
            className="relative min-h-[380px] overflow-hidden sm:min-h-[480px] lg:col-span-6 lg:min-h-[680px]"
          >
            <MediaFrame
              src={IMAGES.stylistCraft}
              alt="Master stylist crafting silky brunette hair in front of an arched brass mirror"
              className="h-full w-full"
              imgClassName="lg:h-full object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#11100F]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#11100F]/35"
            />
          </div>

          {/* Right: Editorial Philosophy & Metrics */}
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-20 lg:col-span-6 lg:px-16 lg:py-24">
            <p className="about-reveal text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase">
              THE LUMIÈRE PHILOSOPHY.
            </p>

            <h2 className="about-reveal mt-5 font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] font-normal text-[#F3EEE6]">
              QUIET CONFIDENCE.
              <br />
              <span className="text-[#EAD5AD]">EXCEPTIONAL CRAFT.</span>
            </h2>

            <div className="about-reveal mt-7 space-y-5 text-[15px] leading-[1.8] text-[#AAA39A] sm:text-base">
              <p>
                We believe the best salon experience is personal. It begins with listening,
                continues with expert hands, and ends with hair that feels as good as it
                looks.
              </p>
              <p>
                Our studio is a calm, welcoming space where creativity meets precision.
              </p>
            </div>

            {/* Three Editorial Statistics */}
            <div className="about-reveal mt-10 grid grid-cols-3 gap-4 border-y border-[#C9A875]/18 py-7 sm:gap-8">
              {STUDIO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-normal text-[#EAD5AD] tabular-nums sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[10px] leading-snug tracking-[0.18em] text-[#AAA39A] uppercase sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="about-reveal mt-10">
              <button
                type="button"
                onClick={() => setIsStoryOpen(true)}
                className="inline-flex min-h-[46px] cursor-pointer items-center gap-3 border border-[#C9A875]/75 bg-transparent px-7 py-3 text-xs font-medium tracking-[0.2em] text-[#EAD5AD] uppercase whitespace-nowrap transition-all duration-200 hover:bg-[#C9A875] hover:text-[#090909]"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Story Dossier Modal */}
      {isStoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-story-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#090909]/85 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setIsStoryOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#C9A875]/25 bg-[#11100F] p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsStoryOpen(false)}
              aria-label="Close studio story"
              className="absolute top-5 right-5 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C9A875]/20 text-[#F3EEE6] transition-colors hover:border-[#C9A875] hover:text-[#EAD5AD]"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[11px] font-medium tracking-[0.26em] text-[#C9A875] uppercase">
              FOUNDED 2012 · THE ATELIER
            </p>
            <h3
              id="studio-story-title"
              className="mt-3 pr-12 font-serif text-2xl font-normal text-[#F3EEE6] sm:text-3xl"
            >
              A Sanctuary Built Around Unhurried Craft
            </h3>

            <div className="mt-6 space-y-4 text-sm leading-[1.8] text-[#AAA39A] sm:text-[15px]">
              <p>
                Since opening our doors in 2012, LUMIÈRE was conceived as an antidote to
                rushed, assembly-line salons. Every chair is spaced for privacy, natural
                spectrum illumination, and unhurried dialogue between client and stylist.
              </p>
              <p>
                Our colorists and architectural cutters work with low-ammonia botanical
                formulations and silk-bond restorative rituals designed to preserve long-term
                hair integrity and luminous, mirror-like shine.
              </p>
              <p>
                Whether sculpting an effortless everyday silhouette or preparing bridal hair
                for an unforgettable evening, every detail is tailored strictly one-on-one.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#C9A875]/15 pt-6">
              <button
                type="button"
                onClick={() => {
                  setIsStoryOpen(false);
                  onBookConsultation();
                }}
                className="inline-flex min-h-[46px] cursor-pointer items-center justify-center border border-[#C9A875] bg-[#C9A875] px-6 py-3 text-xs font-medium tracking-[0.2em] text-[#090909] uppercase whitespace-nowrap transition-colors hover:bg-[#EAD5AD]"
              >
                BOOK A CONSULTATION
              </button>
              <button
                type="button"
                onClick={() => setIsStoryOpen(false)}
                className="inline-flex min-h-[46px] cursor-pointer items-center justify-center border border-[#C9A875]/30 px-6 py-3 text-xs tracking-[0.18em] text-[#F3EEE6] uppercase whitespace-nowrap transition-colors hover:border-[#C9A875]"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
