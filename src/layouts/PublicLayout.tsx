import clsx from 'clsx';
import {
    ChevronDown,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useSite } from '../hooks/useSite';

export function PublicLayout() {
    const site = useSite();
    const studio = site.data.studio;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const aboutRef = useRef<HTMLDivElement>(null);
    const portfolioRef = useRef<HTMLDivElement>(null);

    // Scroll listener for transparent navbar transitioning into translucent ivory
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setAboutDropdownOpen(false);
        setPortfolioDropdownOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
                setAboutDropdownOpen(false);
            }
            if (portfolioRef.current && !portfolioRef.current.contains(e.target as Node)) {
                setPortfolioDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isHome = location.pathname === '/';
    const isHeaderTransparent = isHome && !scrolled;

    return (
        <div className="flex min-h-dvh flex-col bg-[#faf8f5] text-stone-900 font-sans selection:bg-[#c5a880] selection:text-white">
            {/* MINIMAL EDITORIAL HEADER (Zero Watts Style Reference) */}
            <header
                className={clsx(
                    'fixed top-0 inset-x-0 z-50 transition-all duration-300',
                    isHeaderTransparent
                        ? 'bg-transparent text-white pt-3 sm:pt-4 pb-3'
                        : 'bg-[#faf8f5]/95 text-stone-900 backdrop-blur-md shadow-xs border-b border-stone-200/80 py-3 sm:py-4',
                )}
            >
                <div className="container-page flex items-center justify-between">
                    {/* Left Navigation: HOME, ABOUT, PORTFOLIO + */}
                    <nav className="hidden lg:flex items-center gap-9 xl:gap-14 flex-1 justify-end pr-8 xl:pr-14" aria-label="Left Navigation">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                clsx(
                                    'text-xs xl:text-[13px] font-normal tracking-[0.25em] uppercase transition-colors duration-200',
                                    isHeaderTransparent
                                        ? isActive
                                            ? 'text-white font-medium border-b border-white pb-0.5'
                                            : 'text-white/90 hover:text-white drop-shadow-sm'
                                        : isActive
                                          ? 'text-[#8c7047] font-semibold border-b border-[#8c7047] pb-0.5'
                                          : 'text-stone-800 hover:text-[#8c7047]',
                                )
                            }
                        >
                            Home
                        </NavLink>

                        {/* About with Dropdown */}
                        <div
                            ref={aboutRef}
                            className="relative"
                            onMouseEnter={() => setAboutDropdownOpen(true)}
                            onMouseLeave={() => setAboutDropdownOpen(false)}
                        >
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    clsx(
                                        'inline-flex items-center gap-1.5 text-xs xl:text-[13px] font-normal tracking-[0.25em] uppercase transition-colors duration-200',
                                        isHeaderTransparent
                                            ? isActive
                                                ? 'text-white font-medium border-b border-white pb-0.5'
                                                : 'text-white/90 hover:text-white drop-shadow-sm'
                                            : isActive
                                              ? 'text-[#8c7047] font-semibold border-b border-[#8c7047] pb-0.5'
                                              : 'text-stone-800 hover:text-[#8c7047]',
                                    )
                                }
                            >
                                <span>About</span>
                                <ChevronDown
                                    className={clsx(
                                        'size-3 transition-transform duration-200 opacity-80',
                                        aboutDropdownOpen && 'rotate-180',
                                    )}
                                />
                            </NavLink>

                            {/* Dropdown Menu */}
                            {aboutDropdownOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-56 z-50 animate-in fade-in duration-150">
                                    <div className="rounded-sm border border-stone-200 bg-[#faf8f5] p-2 shadow-xl">
                                        <Link
                                            to="/about#history"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            Our Philosophy
                                        </Link>
                                        <Link
                                            to="/about#approach"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            Our Approach
                                        </Link>
                                        <Link
                                            to="/about#team"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            The Team
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Portfolio with "+" symbol */}
                        <div
                            ref={portfolioRef}
                            className="relative"
                            onMouseEnter={() => setPortfolioDropdownOpen(true)}
                            onMouseLeave={() => setPortfolioDropdownOpen(false)}
                        >
                            <NavLink
                                to="/portfolio"
                                className={({ isActive }) =>
                                    clsx(
                                        'inline-flex items-center gap-1 text-xs xl:text-[13px] font-normal tracking-[0.25em] uppercase transition-colors duration-200',
                                        isHeaderTransparent
                                            ? isActive
                                                ? 'text-white font-medium border-b border-white pb-0.5'
                                                : 'text-white/90 hover:text-white drop-shadow-sm'
                                            : isActive
                                              ? 'text-[#8c7047] font-semibold border-b border-[#8c7047] pb-0.5'
                                              : 'text-stone-800 hover:text-[#8c7047]',
                                    )
                                }
                            >
                                <span>Portfolio</span>
                                <span className={clsx('text-xs font-light', isHeaderTransparent ? 'text-white/90' : 'text-[#8c7047]')}>+</span>
                            </NavLink>

                            {/* Dropdown Menu */}
                            {portfolioDropdownOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-56 z-50 animate-in fade-in duration-150">
                                    <div className="rounded-sm border border-stone-200 bg-[#faf8f5] p-2 shadow-xl">
                                        <Link
                                            to="/portfolio?category=Weddings"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            Weddings
                                        </Link>
                                        <Link
                                            to="/portfolio?category=Couples"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            Couples
                                        </Link>
                                        <Link
                                            to="/portfolio?category=Candid"
                                            className="block px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
                                        >
                                            Candid Moments
                                        </Link>
                                        <div className="border-t border-stone-200 mt-1 pt-1.5 px-3">
                                            <Link
                                                to="/portfolio"
                                                className="block py-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8c7047] hover:underline"
                                            >
                                                View All Stories →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Center: Brand Photography Logo (FlashLight - White in Hero, Charcoal when scrolled) */}
                    <div className="flex shrink-0 items-center justify-center">
                        <Link to="/" className="flex flex-col items-center group py-0.5 text-center" aria-label="FlashLight Photography Home">
                            <div className="relative flex flex-col items-center">
                                <img
                                    src="/images/flashlight-emblem.png"
                                    alt={studio.name || 'FlashLight Photography'}
                                    className={clsx(
                                        'h-9 sm:h-11 w-auto object-contain transition-all duration-300 drop-shadow-md',
                                        isHeaderTransparent ? 'filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' : '',
                                    )}
                                />
                                <div className="mt-1 text-center">
                                    <span
                                        className={clsx(
                                            'block font-serif text-[13px] sm:text-[15px] tracking-[0.26em] uppercase leading-none font-medium transition-colors duration-200',
                                            isHeaderTransparent ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-stone-900',
                                        )}
                                    >
                                        Flash Light
                                    </span>
                                    <span
                                        className={clsx(
                                            'block font-sans text-[8px] sm:text-[9px] font-light tracking-[0.38em] uppercase leading-tight mt-0.5 transition-colors duration-200',
                                            isHeaderTransparent ? 'text-white/80 drop-shadow' : 'text-[#8c7047]',
                                        )}
                                    >
                                        Photography
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right Navigation: PRODUCTS, CONTACT */}
                    <nav className="hidden lg:flex items-center gap-9 xl:gap-14 flex-1 justify-start pl-8 xl:pl-14" aria-label="Right Navigation">
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                clsx(
                                    'text-xs xl:text-[13px] font-normal tracking-[0.25em] uppercase transition-colors duration-200',
                                    isHeaderTransparent
                                        ? isActive
                                            ? 'text-white font-medium border-b border-white pb-0.5'
                                            : 'text-white/90 hover:text-white drop-shadow-sm'
                                        : isActive
                                          ? 'text-[#8c7047] font-semibold border-b border-[#8c7047] pb-0.5'
                                          : 'text-stone-800 hover:text-[#8c7047]',
                                )
                            }
                        >
                            Products
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                clsx(
                                    'text-xs xl:text-[13px] font-normal tracking-[0.25em] uppercase transition-colors duration-200',
                                    isHeaderTransparent
                                        ? isActive
                                            ? 'text-white font-medium border-b border-white pb-0.5'
                                            : 'text-white/90 hover:text-white drop-shadow-sm'
                                        : isActive
                                          ? 'text-[#8c7047] font-semibold border-b border-[#8c7047] pb-0.5'
                                          : 'text-stone-800 hover:text-[#8c7047]',
                                )
                            }
                        >
                            Contact
                        </NavLink>
                    </nav>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex lg:hidden items-center">
                        <button
                            type="button"
                            className={clsx(
                                'rounded p-2 transition-colors',
                                isHeaderTransparent ? 'text-white hover:bg-white/10' : 'text-stone-800 hover:bg-stone-100',
                            )}
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileOpen && (
                    <nav className="border-t border-stone-200 bg-[#faf8f5] px-6 py-6 lg:hidden text-center shadow-xl animate-in slide-in-from-top-2 duration-200" aria-label="Mobile Navigation">
                        <ul className="flex flex-col gap-4 text-stone-800">
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/portfolio"
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    Portfolio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/products"
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/products"
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    Products & Albums
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className="block py-2 text-xs font-medium tracking-[0.25em] uppercase hover:text-[#8c7047]"
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <li className="pt-3 border-t border-stone-200">
                                <Link
                                    to="/book"
                                    className="inline-block w-full py-3 bg-stone-900 text-white font-medium uppercase tracking-[0.2em] text-[11px] hover:bg-stone-800 transition-colors"
                                >
                                    Check Availability
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* FLOATING ACTION BUTTONS (CALL & WHATSAPP - Directly Matching Screenshot) */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
                {/* Floating Green Phone Call Action Button */}
                <a
                    href={`tel:${studio.phone || '+919876543210'}`}
                    className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-[#10b981] hover:bg-[#059669] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
                    aria-label="Call FlashLight Photography"
                >
                    <span className="absolute -top-9 right-0 hidden whitespace-nowrap rounded bg-stone-900 px-2.5 py-1 text-[11px] font-medium text-white shadow group-hover:block pointer-events-none">
                        Call Studio
                    </span>
                    <Phone className="size-5 fill-current" />
                </a>

                {/* Floating Green WhatsApp Action Button */}
                <a
                    href={`https://wa.me/${(studio.whatsapp || studio.phone || '919876543210').replace(/\D/g, '')}?text=Hi%20FlashLight%20Photography,%20I%20would%20like%20to%20inquire%20about%20wedding%20photography%20availability.`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex size-13 sm:size-14 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer ring-4 ring-emerald-500/20"
                    aria-label="Chat with FlashLight Photography on WhatsApp"
                >
                    <span className="absolute -top-9 right-0 hidden whitespace-nowrap rounded bg-stone-900 px-2.5 py-1 text-[11px] font-medium text-white shadow group-hover:block pointer-events-none">
                        WhatsApp Us
                    </span>
                    <svg viewBox="0 0 24 24" className="size-7 sm:size-8 fill-current" aria-hidden="true">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.19-.47-.31z"/>
                    </svg>
                </a>
            </div>

            {/* MINIMAL WARM WHITE / CREAM FOOTER (As Requested) */}
            <footer className="border-t border-stone-200/80 bg-[#f5f2eb] text-stone-700">
                <div className="container-page py-16 sm:py-20">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                        {/* Studio Logo & Introduction */}
                        <div className="lg:col-span-2">
                            <Link to="/" className="inline-flex flex-col items-start group" aria-label="FlashLight Photography">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/flashlight-emblem.png"
                                        alt={studio.name || 'FlashLight Photography'}
                                        className="h-10 w-auto object-contain"
                                    />
                                    <div>
                                        <span className="block font-serif text-lg font-medium tracking-[0.2em] text-stone-900 uppercase leading-none">
                                            Flash Light
                                        </span>
                                        <span className="block text-[10px] font-sans font-light tracking-[0.35em] text-[#8c7047] uppercase leading-tight mt-1">
                                            Photography
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <p className="mt-5 max-w-sm font-serif italic text-base leading-relaxed text-stone-600">
                                {studio.tagline || 'We believe every wedding has its own rhythm, emotions and unforgettable moments. Our approach is simple — observe, feel and capture the story naturally.'}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-4 text-xs font-sans tracking-[0.15em] uppercase text-stone-600">
                                {[
                                    ['Instagram', studio.instagram || 'https://instagram.com'],
                                    ['YouTube', studio.youtube || 'https://youtube.com'],
                                    ['WhatsApp', `https://wa.me/${(studio.whatsapp || studio.phone || '919876543210').replace(/\D/g, '')}`],
                                ].map(([platform, href]) => (
                                    <a
                                        key={platform}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="border-b border-stone-300 pb-0.5 hover:border-stone-900 hover:text-stone-950 transition-colors"
                                    >
                                        {platform}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-900">Stories</p>
                            <ul className="mt-5 space-y-3 text-xs tracking-[0.1em] uppercase text-stone-600">
                                <li><Link to="/portfolio?category=Weddings" className="hover:text-stone-950 transition-colors">Weddings</Link></li>
                                <li><Link to="/portfolio?category=Couples" className="hover:text-stone-950 transition-colors">Couples</Link></li>
                                <li><Link to="/portfolio?category=Candid" className="hover:text-stone-950 transition-colors">Candid Moments</Link></li>
                                <li><Link to="/products" className="hover:text-stone-950 transition-colors">Products & Albums</Link></li>
                            </ul>
                        </div>

                        {/* About Links */}
                        <div>
                            <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-900">Studio</p>
                            <ul className="mt-5 space-y-3 text-xs tracking-[0.1em] uppercase text-stone-600">
                                <li><Link to="/about" className="hover:text-stone-950 transition-colors">About Us</Link></li>
                                <li><Link to="/products" className="hover:text-stone-950 transition-colors">Albums & Keepsakes</Link></li>
                                <li><Link to="/contact" className="hover:text-stone-950 transition-colors">Check Availability</Link></li>
                                <li><Link to="/book" className="hover:text-stone-950 transition-colors">Book a Date</Link></li>
                            </ul>
                        </div>

                        {/* Studio Location & Contact */}
                        <div>
                            <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-900">Location</p>
                            <ul className="mt-5 space-y-3 text-xs leading-relaxed text-stone-600">
                                {studio.address && (
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#8c7047]" />
                                        <span>{studio.address}{studio.city ? `, ${studio.city}` : ''}</span>
                                    </li>
                                )}
                                {studio.phone && (
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-3.5 shrink-0 text-[#8c7047]" />
                                        <a href={`tel:${studio.phone}`} className="hover:text-stone-950 transition-colors tracking-wider">
                                            {studio.phone}
                                        </a>
                                    </li>
                                )}
                                {studio.email && (
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-3.5 shrink-0 text-[#8c7047]" />
                                        <a href={`mailto:${studio.email}`} className="hover:text-stone-950 transition-colors">
                                            {studio.email}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans tracking-[0.1em] uppercase text-stone-500">
                        <p>© 2026 {studio.name || 'FlashLight Photography'}. All Rights Reserved.</p>
                        <p className="normal-case font-serif italic text-stone-500">
                            Timeless wedding photography crafted with natural light & emotion.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
