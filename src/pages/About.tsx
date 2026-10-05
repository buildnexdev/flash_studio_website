import {
    Award,
    CheckCircle2,
    Clock,
    HeartHandshake,
    History,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { num } from '../utils/format';

export default function About() {
    const site = useSite();
    const { studio, website, stats } = site.data;
    const aboutText = studio.about?.trim();
    const historyText = website?.historyText;
    const whyChooseUsPoints = website?.whyChooseUs ?? [
        'Instant Live QR Event Galleries — Guests view & download photos in real-time as we shoot',
        'Full Master High-Resolution Digital Rights Included with Every Package',
        'Handcrafted Flush-Mount Layflat Albums with Lifetime UV Archival Protection',
        'Dual-Photographer Coverage (Candid Documentary + Editorial Portraiture)',
        'Transparent Upfront Pricing with All Taxes Included & 24-Hour Date Availability',
    ];

    useSeo({
        title: `About Us | ${studio.name || 'FlashLight Photography'}`,
        description: `Learn more about ${studio.name || 'FlashLight Photography'}, our history, why couples choose us, and our creative team dedicated to documenting life's most cherished celebrations.`,
        keywords: 'about photography studio, wedding photographer team, studio philosophy, why choose us photographer, studio history',
    });

    return (
        <>
            <PageHero
                eyebrow="Our Story & Heritage"
                title={`About ${studio.name || 'FlashLight Photography'}`}
                subtitle={studio.tagline || 'Only Some Moments Become Memories — Preserving the beauty of human connection with artistic vision, documentary discretion, and timeless elegance.'}
            />

            {/* SECTION 1: Our Story & History (#history) */}
            <Section id="history" className="border-b border-stone-200/80">
                <div className="grid gap-12 lg:grid-cols-5 items-start">
                    <div className="lg:col-span-3 space-y-6 text-stone-700 leading-relaxed text-base sm:text-lg">
                        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                            <History className="size-3.5" />
                            <span>Established in 2014</span>
                        </div>
                        <h2 className="font-display text-3xl font-bold text-stone-900 leading-tight">
                            Our Journey & Photographic Heritage
                        </h2>
                        {historyText ? (
                            <p className="leading-relaxed">{historyText}</p>
                        ) : null}

                        {aboutText ? (
                            aboutText.split(/\n{2,}/).map((paragraph, index) => (
                                <p key={index} className="leading-relaxed text-stone-600">
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <>
                                <p className="leading-relaxed text-stone-600">
                                    FlashLight Photography was founded on a singular principle: that some things were never meant to trend for a week, but to endure for years ahead.
                                </p>
                                <p className="leading-relaxed text-stone-600">
                                    Over the past decade, we have refined a hybrid documentary and editorial style. We observe quietly to capture unscripted glances, tears of happiness, and spontaneous laughter, while offering gentle artistic direction during family and couple portraits.
                                </p>
                            </>
                        )}

                        <div className="pt-2 flex flex-wrap gap-4">
                            <ButtonLink to="/book" size="md">
                                Reserve Your Date
                            </ButtonLink>
                            <ButtonLink to="/projects" variant="secondary" size="md">
                                Explore Our Work
                            </ButtonLink>
                        </div>
                    </div>

                    {/* Verified Metrics Counter */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="card p-6 flex items-start gap-4 shadow-xs">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                <Award className="size-6" />
                            </span>
                            <div>
                                <p className="font-display text-2xl font-bold text-stone-900">{num(stats.events)}</p>
                                <p className="text-sm font-semibold text-stone-800 mt-0.5">Events Documented</p>
                                <p className="text-xs text-stone-500 mt-1">
                                    Weddings, milestone birthdays, and housewarmings successfully delivered.
                                </p>
                            </div>
                        </div>

                        <div className="card p-6 flex items-start gap-4 shadow-xs">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <Users className="size-6" />
                            </span>
                            <div>
                                <p className="font-display text-2xl font-bold text-stone-900">{num(stats.customers)}</p>
                                <p className="text-sm font-semibold text-stone-800 mt-0.5">Families & Clients</p>
                                <p className="text-xs text-stone-500 mt-1">
                                    Trusted us to chronicle their lifetime celebrations.
                                </p>
                            </div>
                        </div>

                        <div className="card p-6 flex items-start gap-4 shadow-xs">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <Clock className="size-6" />
                            </span>
                            <div>
                                <p className="font-display text-xl font-bold text-stone-900">Studio Consultations</p>
                                <p className="text-sm font-medium text-stone-800 mt-0.5">
                                    {studio.hours || 'Monday – Saturday by Appointment'}
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                    In-person planning sessions and album swatch reviews.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* SECTION 2: Why Choose Us (#why-choose-us) */}
            <Section id="why-choose-us" className="bg-stone-100/60 border-b border-stone-200/80">
                <div className="mx-auto max-w-3xl text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        <UserCheck className="size-3.5" /> Client Benefits
                    </span>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-stone-900">
                        Why Families & Couples Choose Us
                    </h2>
                    <p className="mt-3 text-base text-stone-600 leading-relaxed">
                        We blend creative artistic craftsmanship with cutting-edge cloud distribution, ensuring an effortless experience from booking through final album delivery.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-1">
                    {whyChooseUsPoints.map((point, idx) => (
                        <div
                            key={idx}
                            className="card p-5 sm:p-6 flex items-start gap-4 border-stone-200 bg-white shadow-xs transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                                <CheckCircle2 className="size-5" />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                                    {point}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* SECTION 3: Creative Team & Philosophy (#team) */}
            <Section id="team">
                <div className="mx-auto max-w-3xl text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                        <Sparkles className="size-3.5" /> Our Creative Team
                    </span>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-stone-900">
                        Visual Artists, Colorists & Album Designers
                    </h2>
                    <p className="mt-3 text-base text-stone-600 leading-relaxed">
                        Our studio brings together specialized talent across documentary shooting, precision strobe lighting, and artisanal bindery production.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="card p-6 text-center space-y-3">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                            <HeartHandshake className="size-7" />
                        </span>
                        <h3 className="font-display text-lg font-bold text-stone-900">Lead Photographers</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            Experienced visual storytellers equipped with top-tier Sony G-Master & prime lenses for unmatched low-light acuity.
                        </p>
                    </div>

                    <div className="card p-6 text-center space-y-3">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                            <Sparkles className="size-7" />
                        </span>
                        <h3 className="font-display text-lg font-bold text-stone-900">Master Colorists & Retouchers</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            Every delivered file undergoes hand-crafted tonal balancing, skin perfecting, and color-accurate master finishing.
                        </p>
                    </div>

                    <div className="card p-6 text-center space-y-3">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="size-7" />
                        </span>
                        <h3 className="font-display text-lg font-bold text-stone-900">Album Specialists</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            Dedicated layout architects working with Italian vegan leather, crystal acrylic covers, and archival bindery partners.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <ButtonLink to="/book" size="lg">
                        Book a Consultation with Our Team
                    </ButtonLink>
                </div>
            </Section>
        </>
    );
}
