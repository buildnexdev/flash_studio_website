export interface NavItem {
    to: string;
    label: string;
    end?: boolean;
}

export const MAIN_NAV_LINKS: NavItem[] = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/packages', label: 'Packages' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/gallery', label: 'Find My Gallery' },
    { to: '/testimonials', label: 'Client Reviews' },
    { to: '/contact', label: 'Contact' },
];

export const FOOTER_QUICK_LINKS: NavItem[] = [
    { to: '/about', label: 'About Our Studio' },
    { to: '/services', label: 'Photography Services' },
    { to: '/packages', label: 'Investment & Packages' },
    { to: '/portfolio', label: 'Featured Portfolio' },
    { to: '/gallery', label: 'Live Event Galleries' },
    { to: '/testimonials', label: 'Client Testimonials' },
    { to: '/book', label: 'Book a Consultation' },
    { to: '/contact', label: 'Contact Studio Team' },
];
