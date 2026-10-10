import { useQuery } from '@tanstack/react-query';
import { fallbackSiteData } from '../data/fallbackData';
import { siteService, type SiteData } from '../services/siteService';

function mergeSiteData(raw: SiteData | undefined): SiteData {
    if (!raw?.studio?.name) return fallbackSiteData;
    return {
        ...fallbackSiteData,
        ...raw,
        studio: { ...fallbackSiteData.studio, ...raw.studio },
        website: raw.website ? { ...fallbackSiteData.website, ...raw.website } : fallbackSiteData.website,
        services: Array.isArray(raw.services) ? raw.services : fallbackSiteData.services,
        packages: Array.isArray(raw.packages) ? raw.packages : fallbackSiteData.packages,
        portfolio: Array.isArray(raw.portfolio) ? raw.portfolio : fallbackSiteData.portfolio,
        testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : fallbackSiteData.testimonials,
        stats: raw.stats ?? fallbackSiteData.stats,
    };
}

export function useSite() {
    const query = useQuery<SiteData>({
        queryKey: ['site'],
        queryFn: siteService.getSiteData,
        staleTime: 5 * 60_000,
        retry: 1,
    });

    const data = mergeSiteData(query.data);
    const isUsingFallback = !query.isSuccess || !query.data?.studio?.name;

    return {
        ...query,
        data,
        isUsingFallback,
    };
}
