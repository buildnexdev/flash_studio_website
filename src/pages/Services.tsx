import { Camera } from 'lucide-react';
import { EmptyState } from '../components/data';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PackageCard } from '../sections/PackageCard';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { money } from '../utils/format';

export default function Services() {
    const site = useSite();
    const { services, packages, studio } = site.data;

    useSeo({
        title: `Photography Services | ${studio.name || 'FlashLight Photography'}`,
        description: 'Explore our full range of photography services: weddings, pre-wedding couple sessions, milestone events, and editorial studio portraiture.',
        keywords: 'wedding photography packages, pre-wedding shoot, event photography services, family portrait session',
    });

    return (
        <>
            <PageHero
                eyebrow="Comprehensive Studio Services"
                title="Professional Photography for Every Milestone"
                subtitle="From your initial consultation and planning sessions to the presentation of your handcrafted printed album, our team ensures an effortless experience."
            />

            <Section>
                {!services.length ? (
                    <EmptyState
                        title="No Services Listed"
                        description="Our current service catalog is being updated. Please contact the studio for custom inquiries."
                    />
                ) : (
                    <div className="space-y-16">
                        {services.map((service) => {
                            const relatedPackages = packages.filter((pkg) => pkg.service_id === service.id);

                            return (
                                <article
                                    key={service.id}
                                    id={service.slug}
                                    className="scroll-mt-28 rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-10 shadow-sm"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start justify-between">
                                        <div className="flex gap-4 items-start flex-1">
                                            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                                                <Camera className="size-7" />
                                            </span>
                                            <div>
                                                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                                                    {service.name}
                                                </h2>
                                                {service.summary && (
                                                    <p className="mt-1.5 text-base font-medium text-brand-800">
                                                        {service.summary}
                                                    </p>
                                                )}
                                                {service.description && (
                                                    <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-stone-600">
                                                        {service.description}
                                                    </p>
                                                )}
                                                {service.base_price > 0 && (
                                                    <p className="mt-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                                                        Starting from {money(service.base_price, true)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex sm:flex-col gap-3">
                                            <ButtonLink to={`/book?service=${service.id}`} variant="primary">
                                                Inquire Now
                                            </ButtonLink>
                                        </div>
                                    </div>

                                    {relatedPackages.length > 0 && (
                                        <div className="mt-8 border-t border-stone-100 pt-8">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-6">
                                                Available Packages for {service.name}
                                            </h3>
                                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                                {relatedPackages.map((pkg) => (
                                                    <PackageCard key={pkg.id} pkg={pkg} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </Section>
        </>
    );
}
