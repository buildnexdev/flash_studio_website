import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { EmptyState } from '../components/data';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { PortfolioGrid } from '../sections/PortfolioGrid';
import { Section } from '../sections/Section';
import { apiAsset, siteService, type PortfolioItem } from '../services/siteService';

export default function Portfolio() {
    const site = useSite();
    const { studio, portfolio: fallbackPortfolio } = site.data;
    const [params, setParams] = useSearchParams();
    const currentCategory = params.get('category') ?? '';

    useSeo({
        title: `Portfolio & Gallery Showcase | ${studio.name || 'FlashLight Photography'}`,
        description: 'Browse our curated collection of wedding photography, couple sessions, and milestone portraits. Stories told through light.',
        keywords: 'wedding photo gallery, photography portfolio, bride groom portraits, pre wedding photoshoot album',
    });

    const portfolioQuery = useQuery({
        queryKey: ['public', 'portfolio', currentCategory],
        queryFn: () => siteService.getPortfolio(currentCategory),
        placeholderData: (prev) => prev,
    });

    const items: PortfolioItem[] = portfolioQuery.data?.items ?? (fallbackPortfolio || []);
    const categories = portfolioQuery.data?.categories ?? [];
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') setLightboxIndex((idx) => (idx === null ? idx : (idx + 1) % items.length));
            if (e.key === 'ArrowLeft') setLightboxIndex((idx) => (idx === null ? idx : (idx - 1 + items.length) % items.length));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, items.length]);

    const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

    return (
        <>
            <PageHero
                eyebrow="Our Curated Works"
                title="Portfolio & Visual Stories"
                subtitle="A curated selection of weddings, portraits, and milestones we have had the honor of documenting. Each image reflects genuine emotions and timeless aesthetics."
            />

            <Section>
                {/* Category Filter Pills */}
                {categories.length > 1 && (
                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setParams({}, { replace: true })}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                !currentCategory
                                    ? 'bg-ink-900 text-white shadow-sm'
                                    : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.category}
                                type="button"
                                onClick={() => setParams({ category: c.category }, { replace: true })}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                    currentCategory === c.category
                                        ? 'bg-ink-900 text-white shadow-sm'
                                        : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                {c.category} ({c.n})
                            </button>
                        ))}
                    </div>
                )}

                {/* Portfolio Grid */}
                {items.length > 0 ? (
                    <PortfolioGrid items={items} onOpen={(i) => setLightboxIndex(i)} />
                ) : (
                    <EmptyState
                        title="No Portfolio Items Found"
                        description="There are currently no items available in this category."
                    />
                )}
            </Section>

            {/* Lightbox Modal */}
            {activeItem && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeItem.title}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none"
                        aria-label="Close image viewer"
                    >
                        <X className="size-6" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none sm:left-8"
                        aria-label="Previous photograph"
                    >
                        <ChevronLeft className="size-6" />
                    </button>

                    <figure className="max-h-full max-w-5xl px-12 sm:px-20 text-center">
                        <img
                            src={apiAsset(activeItem.image_url)}
                            alt={activeItem.title}
                            className="protected-img max-h-[82dvh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        <figcaption className="mt-4 text-center text-sm text-stone-300">
                            <span className="font-semibold text-white">{activeItem.title}</span>
                            {activeItem.category && <span className="text-stone-400"> · {activeItem.category}</span>}
                            {activeItem.description && (
                                <p className="mt-1 text-xs text-stone-400 max-w-md mx-auto">{activeItem.description}</p>
                            )}
                        </figcaption>
                    </figure>

                    <button
                        type="button"
                        onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none sm:right-8"
                        aria-label="Next photograph"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            )}
        </>
    );
}
