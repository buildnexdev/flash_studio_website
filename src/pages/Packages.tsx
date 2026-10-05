import { useState } from 'react';
import { EmptyState } from '../components/data';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PackageCard } from '../sections/PackageCard';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';

export default function Packages() {
    const site = useSite();
    const { packages, services, studio } = site.data;
    const [selectedService, setSelectedService] = useState<number | 'all'>('all');

    useSeo({
        title: `Pricing & Investment | ${studio.name || 'FlashLight Photography'}`,
        description: 'Review transparent photography packages with all taxes included. Compare coverage hours, photo quantities, and heirloom albums.',
        keywords: 'wedding photography pricing, photography package rates, photo coverage price, album packages',
    });

    const usedServices = services.filter((s) => packages.some((p) => p.service_id === s.id));
    const displayedPackages =
        selectedService === 'all'
            ? packages
            : packages.filter((p) => p.service_id === selectedService);

    return (
        <>
            <PageHero
                eyebrow="Transparent Investment"
                title="Curated Packages & Transparent Rates"
                subtitle="All listed rates include comprehensive editing and applicable taxes. Need a tailored schedule or multi-day coverage? Our team can create a custom proposal."
            />

            <Section>
                {/* Filter Tabs */}
                {usedServices.length > 1 && (
                    <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedService === 'all'}
                            onClick={() => setSelectedService('all')}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                selectedService === 'all'
                                    ? 'bg-ink-900 text-white shadow-sm'
                                    : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            All Collections ({packages.length})
                        </button>
                        {usedServices.map((service) => (
                            <button
                                key={service.id}
                                type="button"
                                role="tab"
                                aria-selected={selectedService === service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                    selectedService === service.id
                                        ? 'bg-ink-900 text-white shadow-sm'
                                        : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50'
                                }`}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Package Grid */}
                {displayedPackages.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayedPackages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No Packages Available"
                        description="There are currently no published packages under this category. Please request a custom quote."
                        action={<ButtonLink to="/book">Request Custom Quote</ButtonLink>}
                    />
                )}

                {/* Custom Proposal Banner */}
                <div className="mt-16 rounded-2xl border border-stone-200 bg-stone-100/70 p-8 text-center sm:p-12">
                    <h3 className="font-display text-2xl font-semibold text-stone-900">
                        Need a Bespoke Photography Package?
                    </h3>
                    <p className="mt-2 max-w-xl mx-auto text-sm sm:text-base text-stone-600 leading-relaxed">
                        Planning destination celebrations, intimate elopements, or multi-venue corporate symposiums? We gladly formulate custom agreements tailored to your precise timeline.
                    </p>
                    <div className="mt-6">
                        <ButtonLink to="/book" variant="primary">
                            Request a Bespoke Proposal
                        </ButtonLink>
                    </div>
                </div>
            </Section>
        </>
    );
}
