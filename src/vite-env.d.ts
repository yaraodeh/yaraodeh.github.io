/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSWORD: string;
  readonly VITE_GH_OWNER: string;
  readonly VITE_GH_REPO: string;
  readonly VITE_GH_BRANCH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
