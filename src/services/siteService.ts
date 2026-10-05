import { api, API_BASE } from './api';

export interface Studio {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    mapUrl: string;
    hours: string;
    about: string;
    gstin: string;
    instagram: string;
    facebook: string;
    youtube: string;
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    icon: string | null;
    base_price: number;
    is_active: number;
    sort_order: number;
}

export interface Package {
    id: number;
    service_id: number | null;
    service_name: string | null;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    advance_percent: number;
    features: string[] | string | null;
    photo_count: number | null;
    includes_digital: number;
    includes_album: number;
    duration_hours: number | null;
    is_featured: number;
    is_active: number;
    sort_order: number;
}

export interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    description: string | null;
    is_featured: number;
    sort_order: number;
    image_url: string;
}

export interface Testimonial {
    id: number;
    name: string;
    event_label: string | null;
    quote: string;
    rating: number;
    is_published: number;
    sort_order: number;
}

export interface HeroSlide {
    id?: string;
    image: string;
    title: string;
    highlightText?: string;
    subtitle: string;
    lens?: string;
    shutter?: string;
    iso?: string;
}

export interface ProductItem {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    features: string[];
    image?: string;
}

export interface WebsiteSettings {
    bannerActive: boolean;
    bannerDiscount: string;
    bannerText: string;
    couponCode: string;
    heroSubtitle: string;
    historyText?: string;
    whyChooseUs?: string[];
    slides?: HeroSlide[];
    products?: ProductItem[];
}

export interface SiteData {
    studio: Studio;
    website?: WebsiteSettings;
    services: Service[];
    packages: Package[];
    portfolio: PortfolioItem[];
    testimonials: Testimonial[];
    stats: { events: number; customers: number; photos: number };
}

export const siteService = {
    getSiteData: () => api.get<SiteData>('/api/public/site'),
    getPortfolio: (category?: string) =>
        api.get<{ items: PortfolioItem[]; categories: { category: string; n: number }[] }>('/api/public/portfolio', {
            category: category || undefined,
        }),
    getTestimonials: () => api.get<Testimonial[]>('/api/public/testimonials'),
    sendContact: (data: { name: string; email: string; phone?: string | null; subject: string; message: string; website?: string }) =>
        api.send('POST', '/api/public/contact', data),
    sendEnquiry: (data: Record<string, unknown>) =>
        api.send<{ id: number; bookingNo: string }>('POST', '/api/public/enquiry', data),
};

export const packageFeatures = (p: Pick<Package, 'features'>): string[] => {
    if (!p.features) return [];
    if (Array.isArray(p.features)) return p.features;
    try {
        const v = JSON.parse(p.features);
        return Array.isArray(v) ? v : [];
    } catch {
        return [];
    }
};

export const apiAsset = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${API_BASE}${path}`;
};
