import { useQuery } from '@tanstack/react-query';
import { MessageSquareQuote } from 'lucide-react';
import { EmptyState } from '../components/data';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { TestimonialCard } from '../sections/TestimonialCard';
import { siteService, type Testimonial } from '../services/siteService';

export default function Testimonials() {
    const site = useSite();
    const { studio, testimonials: fallbackTestimonials } = site.data;

    useSeo({
        title: `Client Reviews & Testimonials | ${studio.name || 'FlashLight Photography'}`,
        description: 'Read reviews and testimonials from our wedding couples, families, and commercial clients who trusted us with their memories.',
        keywords: 'photographer reviews, client testimonials, wedding photography feedback, client satisfaction',
    });

    const query = useQuery({
        queryKey: ['public', 'testimonials'],
        queryFn: siteService.getTestimonials,
    });

    const testimonials: Testimonial[] = query.data ?? (fallbackTestimonials || []);

    return (
        <>
            <PageHero
                eyebrow="Client Experiences"
                title="Reviews & Endorsements"
                subtitle="Read unfiltered reflections from couples, families, and creative partners who entrusted our team with their most significant milestones."
            />

            <Section>
                {testimonials.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} t={testimonial} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<MessageSquareQuote className="size-12 text-stone-300" />}
                        title="No Reviews Available Yet"
                        description="New reviews from recent event celebrations will appear here shortly."
                    />
                )}

                {/* Trust Callout */}
                <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-sm">
                    <h3 className="font-display text-2xl font-semibold text-stone-900">
                        Experience Our Dedicated Craftsmanship
                    </h3>
                    <p className="mt-2 max-w-xl mx-auto text-sm sm:text-base text-stone-600 leading-relaxed">
                        We are honored to have documented hundreds of genuine celebrations. Connect with our team today to discuss how we can tell your visual story.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <ButtonLink to="/book" variant="primary">
                            Reserve Your Date
                        </ButtonLink>
                        <ButtonLink to="/portfolio" variant="secondary">
                            View Our Portfolio
                        </ButtonLink>
                    </div>
                </div>
            </Section>
        </>
    );
}
