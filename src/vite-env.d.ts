/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the deployed site, e.g. https://haven.example.com */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
