import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Section({
    title,
    eyebrow,
    subtitle,
    children,
    className,
    dark,
    id,
}: {
    title?: ReactNode;
    eyebrow?: string;
    subtitle?: ReactNode;
    children: ReactNode;
    className?: string;
    dark?: boolean;
    id?: string;
}) {
    return (
        <section id={id} className={clsx('py-16 sm:py-24', dark ? 'bg-ink-900 text-white' : '', className)}>
            <div className="container-page">
                {(title || eyebrow) && (
                    <div className="mx-auto mb-14 max-w-3xl text-center">
                        {eyebrow && (
                            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-[#8c7047]">
                                {eyebrow}
                            </p>
                        )}
                        {title && <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">{title}</h2>}
                        {subtitle && (
                            <p className={clsx('mt-3.5 font-serif italic text-base sm:text-lg', dark ? 'text-stone-300' : 'text-stone-600 leading-relaxed')}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
