import { QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Loading } from '../components/data';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { extractToken } from './GalleryFinder';

/** Guest QR landing on the marketing site. Photos live in the studio app. */
const GALLERY_APP = (import.meta.env.VITE_GALLERY_APP_URL || 'https://apps.nammaqr.in').replace(/\/+$/, '');

export default function QrGallery() {
    const { token: raw = '' } = useParams();
    const token = extractToken(raw);
    const [error] = useState(token ? '' : 'This event gallery link or QR token is invalid.');

    useSeo({
        title: 'Guest Event Gallery | FlashLight Photography',
        description: 'Live event guest gallery for real-time viewing and instant high-resolution photo downloads.',
    });

    useEffect(() => {
        if (!token) return;
        const target = `${GALLERY_APP}/g/${encodeURIComponent(token)}`;
        window.location.replace(target);
    }, [token]);

    return (
        <div className="min-h-dvh bg-ink-900 text-white flex flex-col">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/90 backdrop-blur-md">
                <div className="container-page flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src="/images/flashlight-logo.png" alt="FlashLight Photography" className="h-10 w-auto object-contain" />
                    </Link>
                    <ButtonLink to="/" variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Back to Website
                    </ButtonLink>
                </div>
            </header>

            <main className="container-page flex-1 py-12">
                {error ? (
                    <div className="mx-auto max-w-md py-20 text-center text-white">
                        <QrCode className="mx-auto size-16 text-white/30" />
                        <h1 className="mt-5 text-2xl font-bold font-display">Gallery Unavailable</h1>
                        <p className="mt-3 text-sm text-stone-300 leading-relaxed">{error}</p>
                        <div className="mt-8 flex justify-center">
                            <ButtonLink to="/contact">Contact Studio</ButtonLink>
                        </div>
                    </div>
                ) : (
                    <Loading label="Opening your event gallery…" className="min-h-[50vh] text-white/70" />
                )}
            </main>
        </div>
    );
}
