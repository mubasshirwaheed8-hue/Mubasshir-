import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/salonData';
import { MediaFrame } from './MediaFrame';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.service-card-item', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-20 border-t border-[#C9A875]/12 bg-[#090909] py-24 sm:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 border-b border-[#C9A875]/15 pb-10 lg:mb-18 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase">
              SIGNATURE SERVICES
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,3.8vw,3.35rem)] leading-[1.1] font-normal text-[#F3EEE6]">
              THE ART OF BEAUTIFUL HAIR.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[#AAA39A] sm:text-base">
            Discover our signature services, designed around your individuality.
          </p>
        </div>

        {/* 3-Column Desktop Grid */}
        <div className="services-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.title)}
              className="service-card-item group flex cursor-pointer flex-col border border-[#C9A875]/15 bg-[#11100F] text-left transition-colors duration-300 hover:border-[#C9A875]/55 focus-visible:outline-[#C9A875]"
            >
              {/* Service Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <MediaFrame
                  src={service.image}
                  alt={service.imageAlt}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  style={{ objectPosition: service.objectPosition || 'center center' }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#11100F] via-transparent to-transparent opacity-80"
                />
                <span className="absolute top-4 left-5 font-sans text-xs font-medium tracking-[0.22em] text-[#EAD5AD] tabular-nums">
                  {service.number}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl leading-snug font-normal tracking-[0.02em] text-[#F3EEE6] transition-colors duration-200 group-hover:text-[#EAD5AD]">
                      {service.title}
                    </h3>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-[#C9A875]/75 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#EAD5AD]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="mt-3.5 text-sm leading-[1.7] text-[#AAA39A]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#C9A875]/12 pt-4 text-[11px] tracking-[0.18em] text-[#AAA39A] uppercase">
                  <span className="tabular-nums">Approx. {service.duration}</span>
                  <span className="text-[#C9A875] transition-colors group-hover:text-[#EAD5AD]">
                    Request Service
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
