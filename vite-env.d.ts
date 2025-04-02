/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
