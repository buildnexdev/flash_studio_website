import clsx from 'clsx';
import { Star } from 'lucide-react';
import type { Testimonial } from '../services/siteService';

export function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <figure className="card flex h-full flex-col justify-between p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div>
                <div className="flex gap-1 text-amber-500" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={clsx('size-4', i < t.rating ? 'fill-current' : 'text-stone-300')}
                            aria-hidden
                        />
                    ))}
                </div>
                <blockquote className="mt-5 text-sm leading-relaxed text-stone-700 italic">
                    “{t.quote}”
                </blockquote>
            </div>
            <figcaption className="mt-6 border-t border-stone-100 pt-4">
                <p className="font-semibold text-stone-900">{t.name}</p>
                {t.event_label && <p className="text-xs text-stone-500 mt-0.5">{t.event_label}</p>}
            </figcaption>
        </figure>
    );
}
