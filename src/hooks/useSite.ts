import { useQuery } from '@tanstack/react-query';
import { fallbackSiteData } from '../data/fallbackData';
import { siteService, type SiteData } from '../services/siteService';

export function useSite() {
    const query = useQuery<SiteData>({
        queryKey: ['site'],
        queryFn: siteService.getSiteData,
        staleTime: 5 * 60_000,
        retry: 1,
    });

    const data: SiteData = query.data || fallbackSiteData;

    return {
        ...query,
        data,
        isUsingFallback: !query.data && !!fallbackSiteData,
    };
}
