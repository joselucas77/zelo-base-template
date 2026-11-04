/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import {
  Serwist,
  NetworkOnly,
  StaleWhileRevalidate,
  CacheFirst,
  ExpirationPlugin,
  type PrecacheEntry,
  type SerwistGlobalConfig,
} from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // 1. APIs e Mutações: NUNCA armazena em cache (Segurança Máxima)
    {
      matcher: /^\/api\//,
      handler: new NetworkOnly(),
    },

    // 2. Páginas HTML e Dados de Rotas: StaleWhileRevalidate
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        request.destination === "document" ||
        (sameOrigin && pathname.startsWith("/_next/data/")),
      handler: new StaleWhileRevalidate({
        cacheName: "pages-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 Horas
          }),
        ],
      }),
    },

    // 3. Arquivos Estáticos Imutáveis (JS, CSS, Fontes Woff2): CacheFirst
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        sameOrigin &&
        (pathname.startsWith("/_next/static/") ||
          pathname.match(/\.(woff|woff2|eot|ttf|otf)$/i) ||
          request.destination === "font"),
      handler: new CacheFirst({
        cacheName: "static-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Dias
          }),
        ],
      }),
    },

    // 4. Imagens de Produtos e Mídia: StaleWhileRevalidate
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "image",
      handler: new StaleWhileRevalidate({
        cacheName: "image-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Dias
          }),
        ],
      }),
    },

    ...defaultCache,
  ],
});

serwist.addEventListeners();
