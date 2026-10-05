import { useEffect, useState } from 'react';
import { apiAsset, type HeroSlide, type Studio } from '../services/siteService';

interface HeroSectionProps {
    studio?: Studio;
    slides?: HeroSlide[];
}

const CINEMATIC_SLIDES: HeroSlide[] = [
    {
        id: '1',
        image: '/images/hero-wedding-garlands.jpg',
        title: 'Stories That Stay Forever',
        subtitle: 'Wedding Photography & Films',
    },
    {
        id: '2',
        image: '/images/weddingphoto2.jpg',
        title: 'Timeless Rituals & Sacred Vows',
        subtitle: 'South Indian Wedding Stories',
    },
    {
        id: '3',
        image: '/images/weddingphoto1.jpg',
        title: 'Honest Emotion, Naturally Felt',
        subtitle: 'Fine Art Documentary Photography',
    },
    {
        id: '4',
        image: '/images/hero-couple-petals.jpg',
        title: 'Enduring Love & Intimate Candids',
        subtitle: 'Cinematic Visual Collections',
    },
];

export function HeroSection({ slides }: HeroSectionProps) {
    const activeSlides = slides && slides.length > 0 ? slides : CINEMATIC_SLIDES;
    const [currentIdx, setCurrentIdx] = useState(0);

    // Subtle gentle auto-advance every 7 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [activeSlides.length]);

    const prevSlide = () => {
        setCurrentIdx((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    };

    const nextSlide = () => {
        setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    };

    return (
        <section
            className="relative h-screen min-h-[640px] w-full overflow-hidden select-none bg-stone-900"
            aria-label="Hero Wedding Photography"
        >
            {/* 1. Full-Screen Cinematic Wedding Photographs */}
            {activeSlides.map((s, idx) => (
                <div
                    key={s.id || s.image || idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        currentIdx === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <img
                        src={apiAsset(s.image)}
                        alt={s.title || 'South Indian Wedding Photography'}
                        className="size-full object-cover object-[center_32%] sm:object-[center_28%] transition-transform duration-[8000ms] ease-out scale-100"
                        draggable={false}
                    />
                    {/* Very subtle top & bottom gradient overlay for pristine legibility without dimming faces */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55 pointer-events-none" />
                </div>
            ))}

            {/* 2. Left and Right Thin Stem Arrows (Directly Matching Screenshot) */}
            <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous story slide"
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex size-12 items-center justify-center text-white/85 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            >
                <svg className="size-8 sm:size-10 stroke-[1.25]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                type="button"
                onClick={nextSlide}
                aria-label="Next story slide"
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex size-12 items-center justify-center text-white/85 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            >
                <svg className="size-8 sm:size-10 stroke-[1.25]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* 3. Hero Content: Placed near lower portion with editorial sophistication */}
            <div className="absolute inset-x-0 bottom-12 sm:bottom-16 z-20 container-page flex flex-col items-center text-center px-4">
                <h1 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    Stories That Stay Forever
                </h1>

                <p className="mt-2.5 text-xs sm:text-sm font-sans font-light tracking-[0.35em] uppercase text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    Wedding Photography & Films
                </p>

                <a
                    href="#recent-stories"
                    className="mt-5 inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans font-normal tracking-[0.25em] uppercase text-white hover:text-amber-100 border-b border-white/70 hover:border-white pb-1 transition-all duration-300 group drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                    <span>View Our Stories</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                </a>
            </div>

            {/* Subtle bottom slide line indicator */}
            <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center items-center gap-2">
                {activeSlides.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        aria-label={`Jump to slide ${idx + 1}`}
                        className={`h-1 transition-all duration-300 cursor-pointer ${
                            currentIdx === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
