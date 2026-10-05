import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from '../components/ui';
import { packageFeatures, type Package } from '../services/siteService';
import { money } from '../utils/format';

export function PackageCard({ pkg, cta = true }: { pkg: Package; cta?: boolean }) {
    const features = packageFeatures(pkg);
    const isFeatured = !!pkg.is_featured;

    return (
        <article
            className={clsx(
                'card relative flex flex-col p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
                isFeatured ? 'border-brand-500 ring-2 ring-brand-500/30' : 'hover:border-stone-300',
            )}
        >
            {isFeatured && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                {pkg.service_name ?? 'Featured Package'}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-stone-900">{pkg.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-stone-900">{money(pkg.price, true)}</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
                {pkg.advance_percent}% deposit to reserve date · Inclusive of all taxes
            </p>
            {pkg.description && (
                <p className="mt-4 border-t border-stone-100 pt-4 text-sm leading-relaxed text-stone-600">
                    {pkg.description}
                </p>
            )}
            <ul className="mt-6 flex-1 space-y-3 text-sm">
                {pkg.duration_hours && <Feature>{pkg.duration_hours} Hours of Dedicated Coverage</Feature>}
                {pkg.photo_count && <Feature>{pkg.photo_count}+ High-Resolution Master Edited Photos</Feature>}
                {!!pkg.includes_digital && <Feature>Full Digital High-Res Gallery Access Included</Feature>}
                {!!pkg.includes_album && <Feature>Handcrafted Premium Archival Photo Album</Feature>}
                {features.map((f) => (
                    <Feature key={f}>{f}</Feature>
                ))}
            </ul>
            {cta && (
                <ButtonLink
                    to={`/book?package=${pkg.id}`}
                    className="mt-8 w-full"
                    variant={isFeatured ? 'primary' : 'dark'}
                    size="md"
                >
                    Reserve This Package
                </ButtonLink>
            )}
        </article>
    );
}

function Feature({ children }: { children: ReactNode }) {
    return (
        <li className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="size-3.5" aria-hidden />
            </span>
            <span className="text-stone-700 leading-snug">{children}</span>
        </li>
    );
}
