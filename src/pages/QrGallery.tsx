import { QrCode } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { Loading } from '../components/data';
import { ButtonLink } from '../components/ui';
import { homeFor, useAuth } from '../hooks/useAuth';
import { useSeo } from '../hooks/useSeo';
import { api, errorMessage } from '../services/api';
import { extractToken } from './GalleryFinder';

interface Access {
    session: string;
    galleryId: number;
    expiresAt: number;
}

const storageKey = (token: string) => `pl_gs_${token.slice(0, 24)}`;

function readStored(token: string): Access | null {
    try {
        const v = JSON.parse(sessionStorage.getItem(storageKey(token)) ?? 'null') as Access | null;
        return v && v.expiresAt > Date.now() + 60_000 ? v : null;
    } catch {
        return null;
    }
}

export default function QrGallery() {
    const { token: raw = '' } = useParams();
    const token = extractToken(raw);
    const { user, status } = useAuth();
    const location = useLocation();
    const [access, setAccess] = useState<Access | null>(() => (token ? readStored(token) : null));
    const [error, setError] = useState(token ? '' : 'This event gallery link or QR token is invalid.');
    const attempts = useRef(0);

    useSeo({
        title: 'Guest Event Gallery | FlashLight Photography',
        description: 'Live event guest gallery for real-time viewing and instant high-resolution photo downloads.',
    });

    const exchange = useCallback(async () => {
        if (!token) return;
        attempts.current += 1;
        setError('');
        try {
            const r = await api.post<{ session: string; expiresInHours: number; galleryId: number }>('/api/gallery/access', { token });
            const a = { session: r.session, galleryId: r.galleryId, expiresAt: Date.now() + r.expiresInHours * 3600_000 };
            sessionStorage.setItem(storageKey(token), JSON.stringify(a));
            setAccess(a);
        } catch (e) {
            sessionStorage.removeItem(storageKey(token));
            setAccess(null);
            setError(errorMessage(e));
        }
    }, [token]);

    useEffect(() => {
        if (status === 'loading' || access || !token || error) return;
        void exchange();
    }, [status, access, token, error, exchange]);

    return (
        <div className="min-h-dvh bg-ink-900 text-white flex flex-col">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/90 backdrop-blur-md">
                <div className="container-page flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img
                            src="/images/flashlight-logo.png"
                            alt="FlashLight Photography"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to={homeFor(user)} className="text-sm font-medium text-white/80 hover:text-white">
                                My Account
                            </Link>
                        ) : (
                            <a
                                href={`/login?next=${encodeURIComponent(location.pathname)}`}
                                className="text-sm font-medium text-white/80 hover:text-white"
                            >
                                Client Sign In
                            </a>
                        )}
                        <ButtonLink to="/" variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                            Back to Website
                        </ButtonLink>
                    </div>
                </div>
            </header>

            <main className="container-page flex-1 py-12">
                {error ? (
                    <div className="mx-auto max-w-md py-20 text-center text-white">
                        <QrCode className="mx-auto size-16 text-white/30" />
                        <h1 className="mt-5 text-2xl font-bold font-display">Gallery Unavailable</h1>
                        <p className="mt-3 text-sm text-stone-300 leading-relaxed">{error}</p>
                        <p className="mt-2 text-xs text-stone-400">
                            Please verify the token or request an updated link/QR code from the event host or studio.
                        </p>
                        <div className="mt-8 flex justify-center gap-3">
                            {token && attempts.current <= 2 && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                                    onClick={() => setError('')}
                                >
                                    Retry Access
                                </button>
                            )}
                            <ButtonLink to="/contact">Contact Studio</ButtonLink>
                        </div>
                    </div>
                ) : access ? (
                    <div className="space-y-6">
                        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold font-display">Live Event Gallery</h1>
                                <p className="text-xs text-stone-400 mt-1">Viewing photos in real-time</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live Session Active
                                </span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                            <p className="text-stone-300 text-sm">
                                Gallery photos are synchronized. View and download high-resolution photos directly from your browser.
                            </p>
                        </div>
                    </div>
                ) : (
                    <Loading label="Authenticating gallery session…" className="min-h-[50vh] text-white/70" />
                )}
            </main>
        </div>
    );
}
