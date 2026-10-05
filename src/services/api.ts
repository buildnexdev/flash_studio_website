export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export interface FieldError {
    field: string;
    message: string;
}

export interface Paged<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public errors: FieldError[] = [],
        public code?: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const errorMessage = (err: unknown, fallback = 'An unexpected error occurred. Please try again.') =>
    err instanceof ApiError || err instanceof Error ? err.message || fallback : fallback;

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
    accessToken = t;
};
export const getAccessToken = () => accessToken;

export interface SessionUser {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    roles: string[];
    permissions: string[];
    customerId: number | null;
}

export interface SessionPayload {
    user: SessionUser;
    accessToken: string;
    refreshExpiresAt: string;
    home: string;
}

async function request<T = unknown>(method: string, path: string, body?: unknown, headersInit?: Record<string, string>): Promise<T> {
    const url = `${API_BASE}${path}`;
    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...headersInit,
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const init: RequestInit = {
        method,
        headers,
        credentials: 'include',
    };
    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }

    let res: Response;
    try {
        res = await fetch(url, init);
    } catch {
        throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0);
    }

    const text = await res.text();
    let json: { success?: boolean; message?: string; data?: T; errors?: FieldError[]; code?: string } | null = null;
    if (text) {
        try {
            json = JSON.parse(text);
        } catch {
            json = null;
        }
    }

    if (!res.ok) {
        const msg = json?.message || `Request failed with status ${res.status}`;
        throw new ApiError(msg, res.status, json?.errors ?? [], json?.code);
    }

    if (json && typeof json === 'object' && 'data' in json && json.data !== undefined) {
        return json.data as T;
    }
    return (json ?? ({} as unknown)) as T;
}

export const api = {
    get: <T = unknown>(path: string, params?: Record<string, string | number | boolean | null | undefined>, headers?: Record<string, string>) => {
        let p = path;
        if (params) {
            const sp = new URLSearchParams();
            for (const [k, v] of Object.entries(params)) {
                if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
            }
            const qs = sp.toString();
            if (qs) p += (p.includes('?') ? '&' : '?') + qs;
        }
        return request<T>('GET', p, undefined, headers);
    },
    post: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) => request<T>('POST', path, body, headers),
    send: <T = unknown>(method: string, path: string, body?: unknown, headers?: Record<string, string>): Promise<{ data: T; message: string }> => {
        const url = `${API_BASE}${path}`;
        const h: Record<string, string> = { Accept: 'application/json', ...headers };
        if (accessToken) h.Authorization = `Bearer ${accessToken}`;
        let initBody: string | undefined;
        if (body !== undefined) {
            h['Content-Type'] = 'application/json';
            initBody = JSON.stringify(body);
        }
        return fetch(url, { method, headers: h, credentials: 'include', body: initBody }).then(async (res) => {
            const text = await res.text();
            let json: { success?: boolean; message?: string; data?: T; errors?: FieldError[] } | null = null;
            if (text) {
                try {
                    json = JSON.parse(text);
                } catch {
                    // Ignore non-json
                }
            }
            if (!res.ok) {
                throw new ApiError(json?.message || `Request failed with status ${res.status}`, res.status, json?.errors ?? []);
            }
            return {
                data: (json?.data ?? (json as unknown)) as T,
                message: json?.message || 'Operation successful',
            };
        });
    },
};

export function applyFieldErrors<T extends Record<string, unknown>>(
    err: unknown,
    setError: (name: keyof T, err: { type: string; message: string }) => void,
): boolean {
    if (!(err instanceof ApiError) || !err.errors?.length) return false;
    for (const e of err.errors) {
        setError(e.field as keyof T, { type: 'server', message: e.message });
    }
    return true;
}
