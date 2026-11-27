import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/salonData';
import { MediaFrame } from './MediaFrame';

gsap.registerPlugin(ScrollTrigger);

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.gallery-item-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: '.gallery-grid-wrap',
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_ITEMS.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex]);

  const activeItem = selectedIndex !== null ? GALLERY_ITEMS[selectedIndex] : null;

  return (
    <>
      <section
        id="our-work"
        ref={sectionRef}
        className="relative scroll-mt-20 border-t border-[#C9A875]/12 bg-[#090909] py-24 sm:py-32 lg:py-36"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-14 flex flex-col justify-between gap-6 border-b border-[#C9A875]/15 pb-10 lg:mb-16 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase">
                EDITORIAL PORTFOLIO
              </p>
              <h2 className="mt-4 font-serif text-[clamp(2rem,3.8vw,3.35rem)] leading-[1.1] font-normal text-[#F3EEE6]">
                MADE TO MOVE YOU.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-[#AAA39A] sm:text-base">
              Selected studio commissions, luminous brunette finishes, and the architectural
              calm of our salon.
            </p>
          </div>

          {/* Asymmetrical Magazine Grid */}
          <div className="gallery-grid-wrap grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6 lg:gap-7">
            {GALLERY_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`gallery-item-reveal group relative cursor-pointer overflow-hidden border border-[#C9A875]/15 bg-[#11100F] text-left transition-colors duration-300 hover:border-[#C9A875]/50 focus-visible:outline-[#C9A875] ${item.colSpanClass}`}
              >
                <div className={`w-full overflow-hidden ${item.aspectClass} md:h-full`}>
                  <MediaFrame
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    style={{
                      objectPosition: item.id === 'salon-sanctuary' ? 'center center' : 'center 20%',
                    }}
                  />
                </div>

                {/* Measured Scrim & Editorial Caption */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090909]/92 via-[#090909]/25 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95"
                />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="text-[10px] font-medium tracking-[0.24em] text-[#C9A875] uppercase">
                    {item.category}
                  </p>
                  <h3 className="mt-1.5 font-serif text-lg font-normal text-[#F3EEE6] sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 hidden max-w-md text-xs leading-relaxed text-[#AAA39A] sm:block">
                    {item.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#090909]/92 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col border border-[#C9A875]/25 bg-[#11100F]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090909]">
              <MediaFrame
                src={activeItem.image}
                alt={activeItem.alt}
                className="h-full w-full"
                imgClassName="object-contain bg-[#090909]"
              />
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close gallery preview"
                className="absolute top-4 right-4 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C9A875]/30 bg-[#090909]/80 text-[#F3EEE6] transition-colors hover:border-[#C9A875] hover:text-[#EAD5AD]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] tracking-[0.24em] text-[#C9A875] uppercase">
                  {activeItem.category} · 0{selectedIndex + 1} / 0{GALLERY_ITEMS.length}
                </p>
                <h3 className="mt-1 font-serif text-xl text-[#F3EEE6]">{activeItem.title}</h3>
                <p className="mt-1 text-sm text-[#AAA39A]">{activeItem.caption}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIndex(
                      (selectedIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
                    )
                  }
                  aria-label="Previous look"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C9A875]/30 text-[#F3EEE6] transition-colors hover:border-[#C9A875] hover:text-[#EAD5AD]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % GALLERY_ITEMS.length)}
                  aria-label="Next look"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C9A875]/30 text-[#F3EEE6] transition-colors hover:border-[#C9A875] hover:text-[#EAD5AD]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
