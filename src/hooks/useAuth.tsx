import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, setAccessToken, type SessionPayload, type SessionUser } from '../services/api';

export type Role = 'SUPER_ADMIN' | 'STUDIO_OWNER' | 'MANAGER' | 'PHOTOGRAPHER' | 'EDITOR_DESIGNER' | 'PRINTER_DELIVERY_STAFF' | 'CUSTOMER';

const ROLE_ORDER: Role[] = ['SUPER_ADMIN', 'STUDIO_OWNER', 'MANAGER', 'PHOTOGRAPHER', 'EDITOR_DESIGNER', 'PRINTER_DELIVERY_STAFF', 'CUSTOMER'];
const ROLE_HOME: Record<Role, string> = {
    SUPER_ADMIN: '/admin/dashboard',
    STUDIO_OWNER: '/admin/dashboard',
    MANAGER: '/admin/dashboard',
    PHOTOGRAPHER: '/photographer/dashboard',
    EDITOR_DESIGNER: '/editor/dashboard',
    PRINTER_DELIVERY_STAFF: '/delivery/dashboard',
    CUSTOMER: '/customer/dashboard',
};

export const homeFor = (user: SessionUser | null) => {
    if (!user) return '/login';
    const primary = ROLE_ORDER.find((r) => user.roles.includes(r));
    return primary ? ROLE_HOME[primary] : '/';
};

interface AuthState {
    user: SessionUser | null;
    status: 'loading' | 'authenticated' | 'anonymous';
    logout: () => Promise<void>;
    can: (...perms: string[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [status, setStatus] = useState<AuthState['status']>('loading');

    const checkSession = useCallback(async () => {
        try {
            const data = await api.post<SessionPayload>('/api/auth/refresh');
            if (data?.accessToken && data.user) {
                setAccessToken(data.accessToken);
                setUser(data.user);
                setStatus('authenticated');
                return;
            }
        } catch {
            // Not logged in or refresh failed
        }
        setAccessToken(null);
        setUser(null);
        setStatus('anonymous');
    }, []);

    useEffect(() => {
        void checkSession();
    }, [checkSession]);

    const logout = useCallback(async () => {
        try {
            await api.post('/api/auth/logout');
        } catch {
            // Ignore error
        }
        setAccessToken(null);
        setUser(null);
        setStatus('anonymous');
    }, []);

    const can = useCallback(
        (...perms: string[]) => {
            if (!user) return false;
            if (user.roles.includes('SUPER_ADMIN')) return true;
            return perms.some((p) => user.permissions.includes(p));
        },
        [user],
    );

    return (
        <AuthContext.Provider value={{ user, status, logout, can }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        return {
            user: null,
            status: 'anonymous' as const,
            logout: async () => {},
            can: () => false,
        };
    }
    return ctx;
}
