import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPhraseUrl, languages, phrases } from "@/lib/phrases";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...languages.map((language) => `/${language.slug}`),
    ...phrases.flatMap((phrase) => languages.map((language) => getPhraseUrl(phrase, language.slug))),
  ];

  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
