import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { PublicLayout } from './layouts/PublicLayout';
import { RouteError } from './pages/RouteError';

type Loader = () => Promise<{ default: ComponentType }>;
const page = (load: Loader): Pick<RouteObject, 'lazy'> => ({
    lazy: async () => ({ Component: (await load()).default }),
});

export const router = createBrowserRouter([
    {
        errorElement: <RouteError />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    { index: true, ...page(() => import('./pages/Home')) },
                    { path: 'about', ...page(() => import('./pages/About')) },
                    { path: 'services', ...page(() => import('./pages/Services')) },
                    { path: 'packages', ...page(() => import('./pages/Packages')) },
                    { path: 'portfolio', ...page(() => import('./pages/Portfolio')) },
                    { path: 'projects', ...page(() => import('./pages/Portfolio')) },
                    { path: 'products', ...page(() => import('./pages/Products')) },
                    { path: 'gallery', ...page(() => import('./pages/GalleryFinder')) },
                    { path: 'testimonials', ...page(() => import('./pages/Testimonials')) },
                    { path: 'contact', ...page(() => import('./pages/Contact')) },
                    { path: 'book', ...page(() => import('./pages/Book')) },
                ],
            },
            {
                path: 'g/:token',
                ...page(() => import('./pages/QrGallery')),
            },
            {
                path: '*',
                element: <PublicLayout />,
                children: [
                    {
                        path: '*',
                        ...page(() => import('./pages/NotFound')),
                    },
                ],
            },
        ],
    },
]);
