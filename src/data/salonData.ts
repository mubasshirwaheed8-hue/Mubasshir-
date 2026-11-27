import heroBrunette from '../assets/images/hero_brunette_editorial_1795783822078.jpg';
import macroStrands from '../assets/images/seq_macro_hair_strands_1795783822277.jpg';
import profileFlowing from '../assets/images/seq_profile_flowing_hair_1795783822695.jpg';
import salonInterior from '../assets/images/seq_salon_mirror_reveal_1795783824126.jpg';
import stylistCraft from '../assets/images/about_stylist_craft_1795783824100.jpg';
import cutAndBlowout from '../assets/images/service_cut_and_blowout_1795783824451.jpg';
import colorBalayage from '../assets/images/service_color_balayage_1795783825259.jpg';
import bridalRitual from '../assets/images/service_bridal_ritual_1795783824406.jpg';

export const IMAGES = {
  heroBrunette,
  macroStrands,
  profileFlowing,
  salonInterior,
  stylistCraft,
  cutAndBlowout,
  colorBalayage,
  bridalRitual,
} as const;

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'art-of-the-cut',
    number: '01',
    title: 'THE ART OF THE CUT',
    description:
      'Beautifully considered haircuts tailored to your face shape, texture, personality, and lifestyle.',
    duration: '75 min',
    image: IMAGES.cutAndBlowout,
    imageAlt: 'Model showcasing precision-layered glossy brunette haircut',
    objectPosition: 'center 20%',
  },
  {
    id: 'luxury-hair-color',
    number: '02',
    title: 'LUXURY HAIR COLOR',
    description:
      'Dimensional color, seamless blending, rich tones, and beautifully personalized color transformations.',
    duration: '150 min',
    image: IMAGES.colorBalayage,
    imageAlt: 'Dimensional espresso and honey-caramel hand-painted balayage hair color',
    objectPosition: 'center 20%',
  },
  {
    id: 'signature-blowout',
    number: '03',
    title: 'SIGNATURE BLOWOUT',
    description:
      'Professional styling that creates movement, volume, shine, and effortless sophistication.',
    duration: '60 min',
    image: IMAGES.profileFlowing,
    imageAlt: 'Side profile of silky flowing brunette hair after a luxury blowout',
    objectPosition: 'center 25%',
  },
  {
    id: 'restorative-rituals',
    number: '04',
    title: 'RESTORATIVE HAIR RITUALS',
    description:
      'Premium hair treatments designed to nourish, strengthen, and restore your hair.',
    duration: '45 min',
    image: IMAGES.macroStrands,
    imageAlt: 'Close-up of mirror-gloss healthy dark brunette hair strands',
    objectPosition: 'center center',
  },
  {
    id: 'bridal-occasion',
    number: '05',
    title: 'BRIDAL AND OCCASION STYLING',
    description:
      'Beautifully crafted hairstyles for weddings, celebrations, and unforgettable occasions.',
    duration: '90 min',
    image: IMAGES.bridalRitual,
    imageAlt: 'Sculpted bridal chignon accented with a brushed champagne hairpin',
    objectPosition: 'center 25%',
  },
  {
    id: 'personal-consultation',
    number: '06',
    title: 'PERSONAL HAIR CONSULTATION',
    description:
      'A personalized consultation to understand your hair goals and create your ideal styling experience.',
    duration: '30 min',
    image: IMAGES.stylistCraft,
    imageAlt: 'Master stylist consulting one-on-one with a client in front of a brass mirror',
    objectPosition: 'center 20%',
  },
];

export interface StoryboardPhase {
  phase: string;
  rangeLabel: string;
  start: number;
  end: number;
  headline: string;
  subline: string;
  showCta?: boolean;
}

export const STORYBOARD_PHASES: StoryboardPhase[] = [
  {
    phase: '01',
    rangeLabel: '00 — 20%',
    start: 0,
    end: 0.2,
    headline: 'THE ART OF BEAUTIFUL HAIR.',
    subline: 'Pure radiance begins at the individual strand — luminous, supple, untouched.',
  },
  {
    phase: '02',
    rangeLabel: '20 — 40%',
    start: 0.2,
    end: 0.4,
    headline: 'EVERY DETAIL MATTERS.',
    subline: 'Fluid motion and balanced silhouette revealed in natural golden light.',
  },
  {
    phase: '03',
    rangeLabel: '40 — 60%',
    start: 0.4,
    end: 0.6,
    headline: 'CRAFTED WITH PRECISION.',
    subline: 'Dimensional warmth and effortless flow shaped around your natural texture.',
  },
  {
    phase: '04',
    rangeLabel: '60 — 80%',
    start: 0.6,
    end: 0.8,
    headline: 'WHERE ARTISTRY MEETS ELEGANCE.',
    subline: 'An intimate obsidian and champagne sanctuary designed for unhurried craft.',
  },
  {
    phase: '05',
    rangeLabel: '80 — 100%',
    start: 0.8,
    end: 1.0,
    headline: 'YOUR BEAUTY. YOUR SIGNATURE.',
    subline: 'Poised, confident, and unmistakably yours.',
    showCta: true,
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  image: string;
  alt: string;
  colSpanClass: string;
  aspectClass: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'glossy-editorial',
    title: 'Mirror-Gloss Editorial',
    category: 'Signature Finish',
    caption: 'Silk-smooth brunette lengths balanced with warm champagne reflection.',
    image: IMAGES.heroBrunette,
    alt: 'Glossy brunette hair editorial portrait against obsidian backdrop',
    colSpanClass: 'md:col-span-5',
    aspectClass: 'aspect-[4/5]',
  },
  {
    id: 'luxury-coloring',
    title: 'Hand-Painted Dimension',
    category: 'Luxury Color',
    caption: 'Espresso depth woven with delicate honey-amber ribbons for soft movement.',
    image: IMAGES.colorBalayage,
    alt: 'Luxury dimensional brunette balayage hair coloring portrait',
    colSpanClass: 'md:col-span-7',
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'precision-blowout',
    title: 'Sculpted Movement',
    category: 'Signature Blowout',
    caption: 'Weightless lift at the crown paired with soft, enduring curves.',
    image: IMAGES.cutAndBlowout,
    alt: 'Professional luxury blowout with layered brunette volume',
    colSpanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'stylist-craft',
    title: 'Quiet Mastery',
    category: 'In The Chair',
    caption: 'Tailored one-on-one finishing in natural studio illumination.',
    image: IMAGES.stylistCraft,
    alt: 'Master hairstylist carefully finishing a client haircut in the studio',
    colSpanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'bridal-atelier',
    title: 'Evening & Bridal Form',
    category: 'Occasion Styling',
    caption: 'Architectural chignon anchored with brushed champagne hardware.',
    image: IMAGES.bridalRitual,
    alt: 'Luxury bridal low chignon hairstyle with minimal gold pin',
    colSpanClass: 'md:col-span-4',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'salon-sanctuary',
    title: 'The Lumière Sanctuary',
    category: 'The Studio',
    caption: 'Honed dark marble, backlit brass arches, and unhurried serenity.',
    image: IMAGES.salonInterior,
    alt: 'Elegant obsidian and champagne brass hair salon interior',
    colSpanClass: 'md:col-span-12',
    aspectClass: 'aspect-[21/9]',
  },
];

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  service: string;
}

export const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote:
      "I've never felt more confident leaving a salon. Every detail was considered, and the result was exactly what I wanted.",
    author: 'Camille Laurent',
    service: 'The Art of the Cut · Sample Client Note',
  },
  {
    id: 't2',
    quote:
      'An incredible experience from consultation to finish. The atmosphere, attention, and styling were exceptional.',
    author: 'Elena Rostova',
    service: 'Luxury Hair Color · Sample Client Note',
  },
  {
    id: 't3',
    quote:
      'Beautiful work, thoughtful service, and a team that truly understands hair.',
    author: 'Sophia Vance',
    service: 'Bridal & Signature Blowout · Sample Client Note',
  },
];

export const STUDIO_DEMO_CONTACT = {
  notice: 'Demo Contact Details — Replace with your studio information',
  addressLine1: '42 Rue Saint-Honoré, Atelier Suite 3',
  addressLine2: 'New York · Paris Concept Studio (Demo)',
  phone: '+1 (212) 555-0194',
  email: 'concierge@lumiere-studio.example',
  hours: [
    { days: 'Tue – Fri', time: '09:30 – 19:30' },
    { days: 'Saturday', time: '09:00 – 18:00' },
    { days: 'Sun – Mon', time: 'By Private Arrangement' },
  ],
};
