import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CinematicScrollSection } from './components/CinematicScrollSection';
import { BrandIntroduction } from './components/BrandIntroduction';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { SERVICES } from './data/salonData';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].title);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  const handleSelectService = useCallback(
    (serviceTitle: string) => {
      setSelectedService(serviceTitle);
      scrollToSection('booking');
    },
    [scrollToSection]
  );

  useEffect(() => {
    let refreshTimer: number | undefined;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    };

    window.addEventListener('resize', scheduleRefresh);
    window.addEventListener('load', scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh).catch(() => undefined);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => scheduleRefresh())
        : null;
    resizeObserver?.observe(document.body);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('resize', scheduleRefresh);
      window.removeEventListener('load', scheduleRefresh);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F3EEE6] font-sans">
      <Navbar onNavigate={scrollToSection} />

      <main>
        <HeroSection onDiscoverClick={() => scrollToSection('cinematic-experience')} />

        <CinematicScrollSection
          onDiscoverServices={() => scrollToSection('services')}
        />

        <BrandIntroduction />

        <ServicesSection onSelectService={handleSelectService} />

        <AboutSection onBookConsultation={() => scrollToSection('booking')} />

        <GallerySection />

        <TestimonialsSection />

        <BookingSection preselectedService={selectedService} />
      </main>

      <Footer
        onNavigate={scrollToSection}
        onSelectService={handleSelectService}
      />
    </div>
  );
}
