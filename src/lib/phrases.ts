import data from "../../data/phrases.json";

export type Language = { slug: string; name: string; code: string };
export type Phrase = { slug: string; translations: Record<string, string> };

export const languages: Language[] = data.languages;
export const phrases: Phrase[] = data.phrases;

export const DEFAULT_LANGUAGE = "english";
export const translationLanguages = languages.filter((language) => language.slug !== DEFAULT_LANGUAGE);

export function getLanguage(slug: string): Language | undefined {
  return languages.find((language) => language.slug === slug);
}

export function getPhrase(slug: string): Phrase | undefined {
  return phrases.find((phrase) => phrase.slug === slug);
}

export function getText(phrase: Phrase, languageSlug: string): string {
  return phrase.translations[languageSlug];
}

export function getAudioPath(phrase: Phrase, languageSlug: string): string {
  return `/audio/${phrase.slug}-${languageSlug}.mp3`;
}

export function getPhraseUrl(phrase: Phrase, languageSlug: string): string {
  if (languageSlug === DEFAULT_LANGUAGE) return `/phrases/${phrase.slug}`;
  return `/phrases/${phrase.slug}/${languageSlug}`;
}

export function getRelatedPhrases(phrase: Phrase, count = 3): Phrase[] {
  const index = phrases.findIndex((item) => item.slug === phrase.slug);
  return Array.from({ length: count }, (_, step) => phrases[(index + 1 + step) % phrases.length]);
}
