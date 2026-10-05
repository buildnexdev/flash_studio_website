import { ArrowRight, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/form';
import { Button, ButtonLink } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';

/** Accepts a full gallery link (…/g/<token>) or the code printed on the event card. */
export function extractToken(input: string): string | null {
    const v = input.trim();
    const m = /\/g\/([A-Za-z0-9_-]{16,128})/.exec(v);
    const token = m ? m[1] : v;
    return /^[A-Za-z0-9_-]{16,128}$/.test(token) ? token : null;
}

export default function GalleryFinder() {
    const navigate = useNavigate();
    const { user, can } = useAuth();
    const site = useSite();
    const { studio } = site.data;
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useSeo({
        title: `Find Your Gallery | ${studio.name || 'FlashLight Photography'}`,
        description: 'Scan your event QR code or paste your secure gallery pass-token to view, download, and share high-resolution event photographs.',
        keywords: 'event QR code gallery, wedding guest photos, photo download code, event photos login',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const token = extractToken(inputValue);
        if (!token) {
            setErrorMessage('Please enter a valid 16-character event gallery code or full link.');
            return;
        }
        navigate(`/g/${token}`);
    };

    return (
        <>
            <PageHero
                eyebrow="Instant Event Access"
                title="Access Your Event Gallery"
                subtitle="Enter your event pass-token or paste the complete link provided on your event invitation or QR card to access your images."
            />

            <Section>
                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                    {/* Guest Access Card */}
                    <form onSubmit={handleSubmit} className="card space-y-5 p-8 flex flex-col justify-between" noValidate>
                        <div className="space-y-4">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                                <QrCode className="size-6" />
                            </span>
                            <div>
                                <h2 className="font-display text-xl font-semibold text-stone-900">
                                    Have an Event Link or Passcode?
                                </h2>
                                <p className="mt-1 text-xs text-stone-500">
                                    Guests can view and download photos in real-time as the event is photographed.
                                </p>
                            </div>

                            <Input
                                label="Gallery Passcode or Link"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setErrorMessage('');
                                }}
                                placeholder="Paste link (https://.../g/code) or 16-digit code"
                                error={errorMessage}
                                required
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button type="submit" className="w-full" size="md">
                                Open Guest Gallery <ArrowRight className="size-4 ml-1" />
                            </Button>
                            <p className="text-center text-xs text-stone-500">
                                Pro Tip: You can also scan the QR code printed at the event using your smartphone camera.
                            </p>
                        </div>
                    </form>

                    {/* Event Host / Client Card */}
                    <div className="card space-y-5 p-8 flex flex-col justify-between bg-stone-50/60 border-stone-200">
                        <div className="space-y-4">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                                <ShieldCheck className="size-6" />
                            </span>
                            <div>
                                <h2 className="font-display text-xl font-semibold text-stone-900">
                                    Are You the Event Host?
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                    Sign in to your private client portal to manage complete master galleries, curate your flush-mount album selections, approve digital proofs, and download uncompressed files.
                                </p>
                            </div>

                            <div className="rounded-xl border border-stone-200/80 bg-white p-4 text-xs text-stone-600 space-y-2">
                                <div className="flex items-center gap-2 font-medium text-stone-800">
                                    <Sparkles className="size-4 text-brand-600" />
                                    Client Portal Features:
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-stone-500 pl-1">
                                    <li>View all historical and active bookings</li>
                                    <li>Interactive album selection and design proofing</li>
                                    <li>Full-resolution master digital downloads</li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-2">
                            {user && can('customer.portal') ? (
                                <a
                                    href="/customer/galleries"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 transition-colors"
                                >
                                    Go to Client Portal
                                </a>
                            ) : (
                                <div className="flex flex-col gap-2.5">
                                    <a
                                        href="/login?next=/customer/galleries"
                                        className="inline-flex w-full items-center justify-center rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 transition-colors"
                                    >
                                        Client Sign In
                                    </a>
                                    <ButtonLink to="/book" variant="secondary" className="w-full">
                                        Book a New Session
                                    </ButtonLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
}
