import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'success';
export type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 disabled:bg-brand-700/50 shadow-sm active:translate-y-px',
    secondary: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 disabled:text-stone-400 active:translate-y-px',
    ghost: 'text-stone-700 hover:bg-stone-100 disabled:text-stone-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
    dark: 'bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-900/50 shadow-sm active:translate-y-px',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-600/50',
};

const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
    clsx(
        'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-all duration-150 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
    );

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', loading, icon, className, children, disabled, type = 'button', ...rest },
    ref,
) {
    return (
        <button
            ref={ref}
            type={type}
            className={buttonClass(variant, size, className)}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
            {children}
        </button>
    );
});

export function ButtonLink({
    variant = 'primary',
    size = 'md',
    className,
    ...rest
}: LinkProps & { variant?: Variant; size?: Size }) {
    return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

export function Spinner({ className }: { className?: string }) {
    return <Loader2 className={clsx('animate-spin text-brand-700', className ?? 'size-6')} aria-label="Loading" />;
}

export function Alert({
    tone = 'info',
    title,
    children,
    className,
}: {
    tone?: 'info' | 'warning' | 'error' | 'success';
    title?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    const tones = {
        info: 'border-sky-200 bg-sky-50 text-sky-900',
        warning: 'border-amber-200 bg-amber-50 text-amber-900',
        error: 'border-red-200 bg-red-50 text-red-900',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    };
    return (
        <div role={tone === 'error' ? 'alert' : 'status'} className={clsx('rounded-lg border px-4 py-3 text-sm', tones[tone], className)}>
            {title && <p className="font-semibold">{title}</p>}
            {children && <div className={clsx(title && 'mt-1')}>{children}</div>}
        </div>
    );
}

export function Badge({
    children,
    tone = 'neutral',
    className,
}: {
    children: ReactNode;
    tone?: 'brand' | 'neutral' | 'success' | 'amber';
    className?: string;
}) {
    const tones = {
        brand: 'bg-brand-50 text-brand-700 border-brand-200',
        neutral: 'bg-stone-100 text-stone-700 border-stone-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={clsx('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
            {children}
        </span>
    );
}
