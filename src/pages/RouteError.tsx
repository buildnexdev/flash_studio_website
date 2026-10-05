import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui';

export function RouteError() {
    const error = useRouteError();
    const chunkFailed = error instanceof Error && /dynamically imported module|Importing a module script failed/i.test(error.message);
    const title = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : chunkFailed
        ? 'Application Update Available'
        : 'An Unexpected Error Occurred';
    const detail = chunkFailed
        ? 'The studio website was updated while this page was active. Please reload your browser window.'
        : 'An unexpected issue occurred while rendering this view. Please try again.';

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-20 text-center">
            <h1 className="font-display text-3xl font-semibold text-stone-900">{title}</h1>
            <p className="max-w-md text-sm text-stone-600 leading-relaxed">{detail}</p>
            <div className="mt-4 flex gap-4">
                <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="size-4 mr-2" />
                    Reload Page
                </Button>
                <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}
