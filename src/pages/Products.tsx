import { Check, Sparkles } from 'lucide-react';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { apiAsset, type ProductItem } from '../services/siteService';
import { money } from '../utils/format';

export default function Products() {
    const site = useSite();
    const { studio, website } = site.data;
    const products: ProductItem[] = website?.products ?? [];

    useSeo({
        title: `Fine Art Print Products & Albums | ${studio.name || 'FlashLight Photography'}`,
        description: 'Explore our handcrafted archival products: flush-mount layflat albums, museum canvas wraps, hardwood frames, and engraved keepsake USB boxes.',
        keywords: 'wedding photo album, flush mount layflat album, canvas prints, custom hardwood frames, keepsake USB box',
    });

    return (
        <>
            <PageHero
                eyebrow="Heirloom Craftsmanship"
                title="Handcrafted Albums & Fine Art Keepsakes"
                subtitle="Your most significant photographs deserve to live beyond digital screens. We partner with premier artisanal bindery labs to produce archival prints and albums built to endure generations."
            />

            <Section>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {products.map((prod) => (
                        <article
                            key={prod.id}
                            className="card overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:border-stone-300 group"
                        >
                            {/* Product Visual */}
                            <div className="md:w-5/12 relative aspect-[4/3] md:aspect-auto bg-stone-100 overflow-hidden shrink-0">
                                <img
                                    src={apiAsset(prod.image || '/images/login-showcase-1.jpg')}
                                    alt={prod.name}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                                    {prod.category}
                                </span>
                            </div>

                            {/* Product Info */}
                            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-stone-900 leading-snug">
                                        {prod.name}
                                    </h2>
                                    <div className="mt-2 text-2xl font-bold text-stone-900">
                                        {money(prod.price, true)}
                                        <span className="text-xs font-normal text-stone-500 ml-1.5">
                                            (All taxes included)
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                                        {prod.description}
                                    </p>

                                    {/* Features Checklist */}
                                    <ul className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                                        {prod.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2 text-xs text-stone-700">
                                                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                                                    <Check className="size-3" />
                                                </span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                                    <ButtonLink
                                        to={`/book?message=${encodeURIComponent(`I would like to include the ${prod.name} in my booking.`)}`}
                                        size="sm"
                                        className="w-full"
                                    >
                                        Order or Inquire
                                    </ButtonLink>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Custom Sizing Banner */}
                <div className="mt-16 rounded-2xl border border-brand-200 bg-brand-50/50 p-8 sm:p-10 text-center">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 mb-3">
                        <Sparkles className="size-6" />
                    </span>
                    <h3 className="font-display text-2xl font-bold text-stone-900">
                        Custom Dimensions & Bespoke Lab Ordering
                    </h3>
                    <p className="mt-2 max-w-xl mx-auto text-sm text-stone-600 leading-relaxed">
                        Need panoramic acrylic wall prints, leather-bound parents’ companion albums, or custom framing for your residence? Contact our lab design team for bespoke fabrications.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <ButtonLink to="/contact" variant="primary">
                            Speak with Album Specialist
                        </ButtonLink>
                        <ButtonLink to="/book" variant="secondary">
                            Book Photography Session
                        </ButtonLink>
                    </div>
                </div>
            </Section>
        </>
    );
}
