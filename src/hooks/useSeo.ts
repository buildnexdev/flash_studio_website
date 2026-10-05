import { useEffect } from 'react';

interface SeoProps {
    title: string;
    description?: string;
    keywords?: string;
}

export function useSeo({ title, description, keywords }: SeoProps) {
    useEffect(() => {
        // Set document title
        const baseTitle = 'FlashLight Photography';
        document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} | Only Some Moments Become Memories`;

        // Set or update description meta
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);

            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', description);
        }

        // Set or update keywords meta
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // Update OG title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', document.title);
    }, [title, description, keywords]);
}
