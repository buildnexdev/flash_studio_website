import { Home } from 'lucide-react';
import { ButtonLink } from '../components/ui';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
    useSeo({
        title: 'Page Not Found',
        description: 'The requested page could not be located on FlashLight Photography.',
    });

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
            <span className="font-display text-8xl font-bold tracking-tight text-stone-200">404</span>
            <h1 className="font-display text-3xl font-semibold text-stone-900">Page Not Found</h1>
            <p className="max-w-md text-base text-stone-600 leading-relaxed">
                The page you are attempting to access may have been updated, relocated, or does not exist.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink to="/" variant="primary" size="md">
                    <Home className="size-4 mr-2" />
                    Return to Home
                </ButtonLink>
                <ButtonLink to="/contact" variant="secondary" size="md">
                    Contact Studio
                </ButtonLink>
            </div>
        </div>
    );
}
