import clsx from 'clsx';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { errorMessage } from '../services/api';
import { Button, Spinner } from './ui';

export function Loading({ label = 'Loading…', className }: { label?: string; className?: string }) {
    return (
        <div className={clsx('flex flex-col items-center justify-center gap-3 py-16 text-sm text-stone-500', className)} role="status">
            <Spinner />
            <span>{label}</span>
        </div>
    );
}

export function ErrorState({ error, onRetry, className }: { error: unknown; onRetry?: () => void; className?: string }) {
    return (
        <div className={clsx('flex flex-col items-center justify-center gap-3 px-4 py-14 text-center', className)} role="alert">
            <AlertCircle className="size-10 text-red-500" aria-hidden />
            <p className="max-w-md text-sm text-stone-700">{errorMessage(error)}</p>
            {onRetry && (
                <Button variant="secondary" size="sm" icon={<RefreshCw className="size-4" />} onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}

export function EmptyState({
    title,
    description,
    action,
    icon,
    className,
}: {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    icon?: ReactNode;
    className?: string;
}) {
    return (
        <div className={clsx('flex flex-col items-center justify-center gap-2 px-4 py-14 text-center', className)}>
            <div className="mb-1 text-stone-300">{icon ?? <Inbox className="size-10" aria-hidden />}</div>
            <p className="font-medium text-stone-800">{title}</p>
            {description && <p className="max-w-md text-sm text-stone-500">{description}</p>}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}

export function QueryState<T>({
    query,
    children,
    empty,
    isEmpty,
    loadingLabel,
}: {
    query: { data: T | undefined; isLoading: boolean; isError: boolean; error: unknown; refetch: () => unknown };
    children: (data: T) => ReactNode;
    empty?: ReactNode;
    isEmpty?: (data: T) => boolean;
    loadingLabel?: string;
}) {
    if (query.isLoading) return <Loading label={loadingLabel} />;
    if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
    if (query.data === undefined) return null;
    if (empty && isEmpty?.(query.data)) return <>{empty}</>;
    return <>{children(query.data)}</>;
}
