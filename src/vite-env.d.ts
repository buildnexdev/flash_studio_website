/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_DEV_API_TARGET?: string;
    readonly VITE_STUDIO_NAME?: string;
    readonly VITE_STUDIO_SLUG?: string;
    /** Where /g/:token guest galleries open (studio app). */
    readonly VITE_GALLERY_APP_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
