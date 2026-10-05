const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
const inrWhole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** Amounts are stored in paise in the database. */
export const money = (paise: number | string | null | undefined, whole = false) => {
    const n = Number(paise ?? 0) / 100;
    return (whole ? inrWhole : inr).format(Number.isFinite(n) ? n : 0);
};

export const toPaise = (rupees: number | string) => Math.round(Number(rupees) * 100);
export const toRupees = (paise: number | string | null | undefined) => (paise === null || paise === undefined ? '' : String(Number(paise) / 100));

const STUDIO_TZ = 'Asia/Kolkata';

/** DATE strings 'YYYY-MM-DD' formatted without time zone offset shifts. */
export function date(value: string | Date | null | undefined, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) {
    if (!value) return '—';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { ...opts, timeZone: 'UTC' });
    }
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { ...opts, timeZone: STUDIO_TZ });
}

export function relative(value: string | Date | null | undefined) {
    if (!value) return '';
    const diff = (Date.now() - new Date(value).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
    return date(value instanceof Date ? value : String(value));
}

/** Local today as YYYY-MM-DD for date input minimum bounds. */
export function todayYmd() {
    const now = new Date(Date.now() + 330 * 60_000);
    return now.toISOString().slice(0, 10);
}

export const titleCase = (s: string | null | undefined) =>
    (s ?? '')
        .toLowerCase()
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ');

export const num = (v: number | string | null | undefined) => new Intl.NumberFormat('en-IN').format(Number(v ?? 0));
