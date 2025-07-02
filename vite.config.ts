// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// import { VitePWA } from "vite-plugin-pwa";  // ← commented out to disable PWA

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
-   // VitePWA({ 
-   //   manifestFilename: "manifest.json",
-   //   includeAssets: ["favicon.ico","robots.txt","icons/icon-192.png","icons/icon-512.png"],
-   //   manifest: { /* …your manifest props… */ },
-   //   workbox: { globPatterns: ["**/*.{js,css,html,ico,png,svg}"] }
-   // }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));