import clsx from 'clsx';
import { CheckCircle2, Play, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { HeroSection } from '../sections/HeroSection';
import { apiAsset, type PortfolioItem } from '../services/siteService';

export default function Home() {
    const site = useSite();
    const { studio, website, portfolio } = site.data;

    // Filter state for RECENT STORIES
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    // Form state for LET'S CREATE SOMETHING BEAUTIFUL
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        location: '',
        message: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useSeo({
        title: `${studio.name || 'FlashLight Photography'} | Stories That Stay Forever`,
        description: 'Clean, luxurious South Indian wedding photography studio. Capturing raw emotions, sacred rituals, and candid laughter that endure for generations.',
        keywords: 'FlashLight Photography, South Indian wedding photographer, Chennai wedding photography, candid wedding photographer, Brahmin wedding, Telugu wedding, Tamil wedding cinematography',
    });

    const categories = ['ALL', 'WEDDINGS', 'COUPLES', 'CANDID MOMENTS', 'WEDDING FILMS'];

    const filteredItems = portfolio.filter((item) => {
        if (selectedCategory === 'ALL') return true;
        const cat = item.category.toUpperCase();
        if (selectedCategory === 'WEDDINGS' && cat.includes('WEDDING') && !cat.includes('FILM')) return true;
        if (selectedCategory === 'COUPLES' && (cat.includes('COUPLE') || cat.includes('PRE-WEDDING'))) return true;
        if (selectedCategory === 'CANDID MOMENTS' && (cat.includes('CANDID') || cat.includes('EVENT'))) return true;
        if (selectedCategory === 'WEDDING FILMS' && (cat.includes('FILM') || cat.includes('CINEMA'))) return true;
        return cat === selectedCategory;
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setFormSubmitted(true);
        }, 800);
    };

    return (
        <div className="bg-[#faf8f5] text-stone-900 selection:bg-[#c5a880] selection:text-white">
            {/* 1. HERO SECTION (100vh Full Viewport Edge-to-Edge Photography) */}
            <HeroSection
                studio={studio}
                slides={website?.slides}
            />

            {/* 2. RECENT STORIES (PORTFOLIO SECTION) */}
            <section id="recent-stories" className="py-24 sm:py-32 container-page">
                <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
                    <span className="block text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#8c7047] mb-3">
                        Curated Collections
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
                        RECENT STORIES
                    </h2>
                    <p className="mt-3 font-serif italic text-base sm:text-lg text-stone-600 font-light">
                        Love, laughter and moments captured beautifully.
                    </p>

                    {/* Elegant Text Filters (No bulky buttons) */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-[13px] tracking-[0.2em] uppercase font-sans">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={clsx(
                                    'relative pb-1.5 transition-all duration-200 cursor-pointer font-normal',
                                    selectedCategory === cat
                                        ? 'text-stone-900 font-medium border-b-2 border-[#8c7047]'
                                        : 'text-stone-500 hover:text-stone-900',
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editorial / Masonry Gallery with Varied Aspect Ratios */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {filteredItems.map((item: PortfolioItem, idx: number) => {
                        // Varied aspect ratio layout for editorial flow
                        const isSpanTwo = idx === 0 || idx === 5;
                        return (
                            <article
                                key={item.id}
                                className={clsx(
                                    'group relative overflow-hidden bg-stone-100 transition-all duration-500 cursor-pointer',
                                    isSpanTwo ? 'md:col-span-2 lg:col-span-2 aspect-[16/10]' : 'aspect-[4/5]',
                                )}
                                onClick={() => setLightboxIndex(idx)}
                            >
                                <img
                                    src={apiAsset(item.image_url)}
                                    alt={item.title}
                                    loading="lazy"
                                    className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    draggable={false}
                                />

                                {/* Subtle elegant hover caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 sm:p-8 text-white">
                                    <span className="text-[10px] sm:text-xs font-sans font-light tracking-[0.3em] uppercase text-[#e0cca7]">
                                        {item.category}
                                    </span>
                                    <h3 className="mt-1 font-serif text-lg sm:text-2xl font-normal leading-snug">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="mt-1 font-serif italic text-xs sm:text-sm text-stone-300 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <span className="mt-3 text-[11px] tracking-[0.2em] uppercase font-sans text-white/90 underline underline-offset-4">
                                        View Story →
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/portfolio"
                        className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans font-normal tracking-[0.25em] uppercase text-stone-900 hover:text-[#8c7047] border-b border-stone-400 hover:border-[#8c7047] pb-1.5 transition-all group"
                    >
                        <span>Explore All Wedding Stories</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </section>

            {/* 3. ABOUT SECTION (Minimal Spacious Two-Column Section) */}
            <section className="py-24 sm:py-32 border-t border-stone-200/80 bg-white">
                <div className="container-page">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        {/* Left: Large Wedding Photograph */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative aspect-[3/4] max-w-lg mx-auto overflow-hidden bg-stone-100 shadow-sm">
                                <img
                                    src="/images/weddingphoto1.jpg"
                                    alt="Sacred South Indian Wedding Rituals"
                                    className="size-full object-cover object-[center_35%] transition-transform duration-700 hover:scale-103"
                                    loading="lazy"
                                />
                            </div>
                            {/* Delicate secondary frame accent */}
                            <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 h-56 border border-stone-300/80 pointer-events-none -z-10" />
                        </div>

                        {/* Right: Studio Editorial Text & Approach */}
                        <div className="lg:col-span-6 lg:pl-6 max-w-xl">
                            <span className="text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#8c7047]">
                                ABOUT THE STUDIO
                            </span>

                            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 leading-[1.18] tracking-tight">
                                Capturing honest emotions and timeless memories.
                            </h2>

                            <blockquote className="mt-8 pl-5 border-l-2 border-[#8c7047] font-serif italic text-lg sm:text-xl text-stone-700 leading-relaxed">
                                “We believe every wedding has its own rhythm, emotions and unforgettable moments. Our approach is simple — observe, feel and capture the story naturally.”
                            </blockquote>

                            <p className="mt-6 text-sm sm:text-base leading-relaxed text-stone-600 font-sans font-light">
                                From the auspicious thali tying moment and delicate fragrant jasmine flowers to uninhibited laughter with loved ones, we preserve South Indian weddings with warmth, restraint, and editorial finesse. We step back when you are living the moment, and step forward only to gently guide.
                            </p>

                            <div className="mt-10">
                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans font-medium tracking-[0.25em] uppercase text-stone-900 hover:text-[#8c7047] border-b border-stone-900 hover:border-[#8c7047] pb-1.5 transition-all group"
                                >
                                    <span>OUR APPROACH</span>
                                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WEDDING FILMS SECTION (Cinematic Video Frame with Centered Play Button) */}
            <section id="wedding-films" className="py-24 sm:py-32 container-page">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <span className="block text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#8c7047] mb-3">
                        Cinematography
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
                        WEDDING FILMS
                    </h2>
                    <p className="mt-3 font-serif italic text-base sm:text-lg text-stone-600">
                        Stories that deserve to be watched again and again.
                    </p>
                </div>

                {/* Cinematic Film Thumbnail Container */}
                <div className="relative aspect-[16/9] max-w-5xl mx-auto overflow-hidden bg-stone-900 shadow-xl group">
                    <img
                        src="/images/weddingphoto2.jpg"
                        alt="Cinematic Wedding Film Trailer"
                        className="size-full object-cover object-center filter brightness-[0.8] transition-transform duration-1000 group-hover:scale-103"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Centered Circular Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => setVideoModalOpen(true)}
                            aria-label="Play Wedding Film Reel"
                            className="size-16 sm:size-22 rounded-full border border-white/60 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:bg-white hover:text-stone-950 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-2xl group/play"
                        >
                            <Play className="size-6 sm:size-8 fill-current ml-1 transition-transform group-hover/play:scale-110" />
                        </button>
                    </div>

                    {/* Film Meta Caption */}
                    <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 text-white pointer-events-none">
                        <p className="text-[10px] sm:text-xs font-sans font-light tracking-[0.3em] uppercase text-[#e0cca7]">
                            Featured Wedding Trailer
                        </p>
                        <h3 className="font-serif text-lg sm:text-2xl font-normal mt-1">
                            Ananya & Karthik — The Palace Celebration
                        </h3>
                    </div>
                </div>
            </section>

            {/* 5. CONTACT / BOOKING SECTION (Clean Minimal Warm Ivory) */}
            <section id="contact-booking" className="py-24 sm:py-32 border-t border-stone-200/80 bg-[#f7f4ee]">
                <div className="container-page max-w-4xl">
                    <div className="text-center mb-14 sm:mb-16">
                        <span className="block text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#8c7047] mb-3">
                            Connect With Us
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
                            LET’S CREATE SOMETHING BEAUTIFUL
                        </h2>
                        <p className="mt-3 font-serif italic text-base sm:text-lg text-stone-600 max-w-xl mx-auto">
                            Tell us about your celebration, wedding dates, and vision. We would love to be part of your story.
                        </p>
                    </div>

                    {formSubmitted ? (
                        <div className="bg-white p-8 sm:p-12 text-center border border-stone-200 shadow-sm animate-in fade-in duration-300">
                            <CheckCircle2 className="size-12 text-[#10b981] mx-auto mb-4" />
                            <h3 className="font-serif text-2xl text-stone-900">Thank You, {formData.name || 'Friend'}!</h3>
                            <p className="mt-2 text-stone-600 font-sans text-sm max-w-md mx-auto">
                                We have received your wedding inquiry and will check our team’s availability for {formData.date || 'your celebration date'}. We will reach out within 24 hours.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormSubmitted(false);
                                    setFormData({ name: '', phone: '', email: '', date: '', location: '', message: '' });
                                }}
                                className="mt-6 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#8c7047] underline underline-offset-4"
                            >
                                Send another inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-6 sm:space-y-8 bg-white p-8 sm:p-12 border border-stone-200/80 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                        Your Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Bride or Groom name"
                                        className="w-full border-b border-stone-300 bg-transparent px-1 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="w-full border-b border-stone-300 bg-transparent px-1 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@domain.com"
                                        className="w-full border-b border-stone-300 bg-transparent px-1 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                        Wedding Date *
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full border-b border-stone-300 bg-transparent px-1 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                    Wedding Location / City *
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Chennai / Coimbatore / Bengaluru / Madurai"
                                    className="w-full border-b border-stone-300 bg-transparent px-1 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs font-sans uppercase tracking-[0.15em] text-stone-700 mb-2 font-medium">
                                    Message & Event Vision
                                </label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us about the ceremonies (Reception, Muhurtham, Sangeet), venues, or specific requirements..."
                                    className="w-full border-b border-stone-300 bg-transparent px-1 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="pt-4 text-center">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-stone-900 hover:bg-[#8c7047] text-white text-xs font-sans font-medium tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-50"
                                >
                                    <span>{submitting ? 'CHECKING...' : 'CHECK AVAILABILITY →'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            {/* LIGHTBOX MODAL FOR GALLERY IMAGES */}
            {lightboxIndex !== null && filteredItems[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="size-8" />
                    </button>
                    <div
                        className="max-w-5xl max-h-[90vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={apiAsset(filteredItems[lightboxIndex].image_url)}
                            alt={filteredItems[lightboxIndex].title}
                            className="max-h-[80vh] w-auto object-contain shadow-2xl"
                        />
                        <div className="mt-4 text-center text-white">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#e0cca7]">
                                {filteredItems[lightboxIndex].category}
                            </p>
                            <h3 className="font-serif text-xl sm:text-2xl mt-1">
                                {filteredItems[lightboxIndex].title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* WEDDING FILM MODAL */}
            {videoModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setVideoModalOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setVideoModalOpen(false)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 cursor-pointer"
                        aria-label="Close video"
                    >
                        <X className="size-8" />
                    </button>
                    <div
                        className="w-full max-w-4xl aspect-[16/9] bg-black flex flex-col items-center justify-center relative shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Film Preview Simulation with High-Def cinematic wedding photo */}
                        <img
                            src="/images/weddingphoto2.jpg"
                            alt="Film Playing"
                            className="size-full object-cover filter brightness-[0.7]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white bg-black/40">
                            <span className="size-16 rounded-full border border-white/60 flex items-center justify-center mb-4">
                                <Play className="size-7 fill-white ml-1" />
                            </span>
                            <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#e0cca7]">
                                FlashLight Cinematography Reel
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl mt-2">
                                Authentic South Indian Wedding Cinema
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm text-stone-300 font-sans max-w-md">
                                Ultra-HD 4K cinematography capturing intimate vows, emotional saptapadi, and vibrant celebrations.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
