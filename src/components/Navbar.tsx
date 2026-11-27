import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { label: 'Our Story', target: 'our-story' },
  { label: 'Services', target: 'services' },
  { label: 'The Studio', target: 'the-studio' },
  { label: 'Our Work', target: 'our-work' },
  { label: 'Contact', target: 'contact' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 36);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
      setScrollProgress(ratio);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  const handleLinkClick = (target: string) => {
    setIsMobileOpen(false);
    onNavigate(target);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-[#C9A875]/15 bg-[#090909]/92 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-[#090909]/80 via-[#090909]/35 to-transparent'
        }`}
      >
        {/* Scroll progress hairline */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full bg-transparent"
        >
          <div
            className="h-full bg-gradient-to-r from-[#C9A875]/60 via-[#EAD5AD] to-[#C9A875] transition-[width] duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8 lg:gap-8 lg:px-12 lg:py-4">
          {/* Left: Brand Lockup */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('hero');
            }}
            className="group flex shrink-0 flex-col focus-visible:outline-[#C9A875]"
          >
            <span className="font-serif text-xl font-medium tracking-[0.22em] text-[#F3EEE6] transition-colors duration-200 group-hover:text-[#EAD5AD] sm:text-2xl">
              LUMIÈRE
            </span>
            <span className="mt-0.5 whitespace-nowrap text-[9px] font-normal tracking-[0.24em] text-[#C9A875] sm:text-[10px]">
              THE ART OF BEAUTIFUL HAIR.
            </span>
          </a>

          {/* Center: Navigation Links */}
          <nav aria-label="Primary Navigation" className="hidden items-center gap-7 lg:flex xl:gap-9">
            {NAV_LINKS.map((item) => (
              <a
                key={item.target}
                href={`#${item.target}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.target);
                }}
                className="group relative shrink-0 whitespace-nowrap py-1 text-[13px] font-normal tracking-[0.12em] text-[#F3EEE6]/85 uppercase transition-colors duration-200 hover:text-[#EAD5AD]"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-[1px] origin-left scale-x-0 bg-[#C9A875] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* Right: Primary CTA + Mobile Hamburger */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => handleLinkClick('booking')}
              className="hidden min-h-[42px] shrink-0 cursor-pointer items-center justify-center border border-[#C9A875]/75 bg-transparent px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] text-[#EAD5AD] uppercase whitespace-nowrap transition-all duration-200 hover:border-[#EAD5AD] hover:bg-[#C9A875] hover:text-[#090909] sm:inline-flex"
            >
              BOOK AN APPOINTMENT
            </button>

            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C9A875]/30 text-[#F3EEE6] transition-colors duration-200 hover:border-[#C9A875] hover:text-[#EAD5AD] lg:hidden"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        aria-hidden={!isMobileOpen}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-[#090909]/98 px-6 pt-28 pb-10 backdrop-blur-xl transition-all duration-400 lg:hidden ${
          isMobileOpen
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 -translate-y-4'
        }`}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-[#C9A875]/15">
          {NAV_LINKS.map((item, idx) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.target);
              }}
              className="flex min-h-[56px] items-center justify-between py-4 font-serif text-2xl tracking-[0.06em] text-[#F3EEE6] transition-colors hover:text-[#C9A875]"
              style={{
                transitionDelay: isMobileOpen ? `${idx * 45}ms` : '0ms',
              }}
            >
              <span>{item.label}</span>
              <span className="font-sans text-xs tracking-[0.2em] text-[#C9A875]/75 tabular-nums">
                0{idx + 1}
              </span>
            </a>
          ))}
        </nav>

        <div className="space-y-4 border-t border-[#C9A875]/20 pt-6">
          <p className="text-xs tracking-[0.2em] text-[#AAA39A] uppercase">
            Private Studio Appointments
          </p>
          <button
            type="button"
            onClick={() => handleLinkClick('booking')}
            className="flex min-h-[48px] w-full cursor-pointer items-center justify-center border border-[#C9A875] bg-[#C9A875] px-6 py-3 text-xs font-medium tracking-[0.2em] text-[#090909] uppercase transition-colors hover:bg-[#EAD5AD]"
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>
    </>
  );
}
