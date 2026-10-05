/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEV_API_TARGET?: string;
    readonly VITE_STUDIO_NAME?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
