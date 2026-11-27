import { Instagram, ArrowUp } from 'lucide-react';
import { SERVICES, STUDIO_DEMO_CONTACT } from '../data/salonData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectService: (serviceTitle: string) => void;
}

const FOOTER_NAV = [
  { label: 'Our Story', target: 'our-story' },
  { label: 'Services', target: 'services' },
  { label: 'The Studio', target: 'the-studio' },
  { label: 'Our Work', target: 'our-work' },
  { label: 'Book Appointment', target: 'booking' },
];

export function Footer({ onNavigate, onSelectService }: FooterProps) {
  return (
    <footer
      id="contact"
      className="border-t border-[#C9A875]/15 bg-[#090909] pt-20 pb-10 text-[#F3EEE6]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('hero');
              }}
              className="inline-flex flex-col"
            >
              <span className="font-serif text-2xl font-medium tracking-[0.24em] text-[#F3EEE6]">
                LUMIÈRE
              </span>
              <span className="mt-1 text-[10px] tracking-[0.26em] text-[#C9A875]">
                THE ART OF BEAUTIFUL HAIR.
              </span>
            </a>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#AAA39A]">
              An exclusive luxury hair studio devoted to thoughtful styling, dimensional
              color, and quiet craftsmanship.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-4">
              <a
                href={`mailto:${STUDIO_DEMO_CONTACT.email}`}
                aria-label="Instagram (Placeholder studio social link)"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('booking');
                }}
                className="inline-flex min-h-[42px] items-center gap-2.5 border border-[#C9A875]/25 px-4 py-2 text-xs tracking-[0.18em] text-[#EAD5AD] uppercase transition-colors hover:border-[#C9A875] hover:bg-[#C9A875] hover:text-[#090909]"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                <span>@lumiere.atelier</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium tracking-[0.24em] text-[#C9A875] uppercase">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#AAA39A]">
              {FOOTER_NAV.map((item) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.target);
                    }}
                    className="transition-colors hover:text-[#EAD5AD]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Links */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-medium tracking-[0.24em] text-[#C9A875] uppercase">
              Signature Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#AAA39A]">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="cursor-pointer text-left transition-colors hover:text-[#EAD5AD]"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Demo Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-medium tracking-[0.24em] text-[#C9A875] uppercase">
              Studio Contact
            </h3>
            <p className="mt-2 text-[11px] text-[#AAA39A]/80 italic">
              {STUDIO_DEMO_CONTACT.notice}
            </p>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-[#AAA39A]">
              <p className="text-[#F3EEE6]">{STUDIO_DEMO_CONTACT.addressLine1}</p>
              <p>{STUDIO_DEMO_CONTACT.addressLine2}</p>
              <p className="pt-2">
                <a
                  href={`tel:${STUDIO_DEMO_CONTACT.phone.replace(/[^+\d]/g, '')}`}
                  className="tabular-nums transition-colors hover:text-[#EAD5AD]"
                >
                  {STUDIO_DEMO_CONTACT.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${STUDIO_DEMO_CONTACT.email}`}
                  className="transition-colors hover:text-[#EAD5AD]"
                >
                  {STUDIO_DEMO_CONTACT.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[#C9A875]/12 pt-8 text-xs tracking-[0.18em] text-[#AAA39A] sm:flex-row sm:items-center">
          <p>© 2026 LUMIÈRE STUDIO. ALL RIGHTS RESERVED.</p>
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 uppercase transition-colors hover:text-[#EAD5AD]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#C9A875]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
