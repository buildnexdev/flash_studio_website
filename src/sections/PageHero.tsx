import clsx from 'clsx';
import type { ReactNode } from 'react';

export function PageHero({
    title,
    subtitle,
    eyebrow,
    children,
    className,
}: {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <header className={clsx('relative overflow-hidden bg-[#faf8f5] pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-stone-200/80 text-stone-900', className)}>
            <div className="container-page relative max-w-4xl text-center mx-auto">
                {eyebrow && (
                    <p className="mb-3 text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-[#8c7047]">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-900">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 max-w-2xl mx-auto font-serif italic text-base sm:text-lg leading-relaxed text-stone-600">
                        {subtitle}
                    </p>
                )}
                {children && <div className="mt-8 flex justify-center">{children}</div>}
            </div>
        </header>
    );
}
