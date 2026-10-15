import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { site } from "./src/data/site.ts";

export default defineConfig({
  site: site.origin,
  base: site.base,
  trailingSlash: "always",
  i18n: { locales: ["en", "id", "ja"], defaultLocale: "en", routing: { prefixDefaultLocale: false } },
  integrations: [sitemap({
    filter: page => !page.endsWith("/404/"),
    i18n: { defaultLocale: "en", locales: { en: "en", id: "id", ja: "ja" } },
  })],
});
