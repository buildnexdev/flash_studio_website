import { CalendarCheck, MessageSquare, Sparkles } from 'lucide-react';
import { ButtonLink } from '../components/ui';

export function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-indigo-900 py-16 text-white sm:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="container-page relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-100">
                        <Sparkles className="size-3.5" /> Date Reservations Open
                    </span>
                    <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                        Ready to Preserve Your Next Milestone?
                    </h2>
                    <p className="mt-3 text-base text-brand-100/90 leading-relaxed sm:text-lg">
                        Tell us about your celebration or portrait vision. Our booking team will review date availability and provide a tailored quotation within 24 hours.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <ButtonLink to="/book" size="lg" variant="dark" className="shadow-lg">
                        <CalendarCheck className="size-5 mr-1" />
                        Book a Consultation
                    </ButtonLink>
                    <ButtonLink
                        to="/contact"
                        size="lg"
                        variant="secondary"
                        className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    >
                        <MessageSquare className="size-5 mr-1" />
                        Contact Studio
                    </ButtonLink>
                </div>
            </div>
        </section>
    );
}
