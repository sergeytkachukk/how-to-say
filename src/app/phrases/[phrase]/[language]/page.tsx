import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import {
  getAudioPath,
  getLanguage,
  getPhrase,
  getPhraseUrl,
  getRelatedPhrases,
  getText,
  languages,
  phrases,
  translationLanguages,
} from "@/lib/phrases";

type Props = { params: Promise<{ phrase: string; language: string }> };

// Only phrases from data/phrases.json exist. Any other address shows the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return phrases.flatMap((phrase) =>
    translationLanguages.map((language) => ({ phrase: phrase.slug, language: language.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phrase: phraseSlug, language: languageSlug } = await params;
  const phrase = getPhrase(phraseSlug);
  const language = getLanguage(languageSlug);
  if (!phrase || !language) return {};

  const english = getText(phrase, "english");
  const text = getText(phrase, language.slug);

  return {
    title: `How to say "${english}" in ${language.name}`,
    description: `"${english}" in ${language.name} is "${text}". Listen to how it sounds and see the same phrase in other languages.`,
    alternates: { canonical: getPhraseUrl(phrase, language.slug) },
  };
}

export default async function TranslationPage({ params }: Props) {
  const { phrase: phraseSlug, language: languageSlug } = await params;
  const phrase = getPhrase(phraseSlug);
  const language = getLanguage(languageSlug);
  // English has its own page at /phrases/[phrase], so it is not valid here.
  if (!phrase || !language || language.slug === "english") notFound();

  const english = getText(phrase, "english");
  const text = getText(phrase, language.slug);
  const pageUrl = getPhraseUrl(phrase, language.slug);
  const otherLanguages = languages.filter((item) => item.slug !== language.slug);

  const audioJsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: `"${english}" in ${language.name}`,
    description: `The ${language.name} phrase "${text}" read aloud. It means "${english}".`,
    contentUrl: `${SITE_URL}${getAudioPath(phrase, language.slug)}`,
    encodingFormat: "audio/mpeg",
    inLanguage: language.code,
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: language.name, url: `/${language.slug}` },
          { name: english, url: pageUrl },
        ]}
      />
      <h1>
        How to say &quot;{english}&quot; in {language.name}
      </h1>

      <div className="phrase-card">
        <p className="big-phrase" lang={language.code}>
          {text}
        </p>
        <AudioPlayer src={getAudioPath(phrase, language.slug)} label={`Listen to ${english} in ${language.name}`} />
      </div>

      <h2>{english} in other languages</h2>
      <ul className="phrase-list">
        {otherLanguages.map((item) => (
          <li key={item.slug}>
            <Link href={getPhraseUrl(phrase, item.slug)}>
              <span lang={item.code}>{getText(phrase, item.slug)}</span>
              <small>{item.name}</small>
            </Link>
          </li>
        ))}
      </ul>

      <h2>More phrases in {language.name}</h2>
      <ul className="phrase-list">
        {getRelatedPhrases(phrase).map((related) => (
          <li key={related.slug}>
            <Link href={getPhraseUrl(related, language.slug)}>
              <span lang={language.code}>{getText(related, language.slug)}</span>
              <small>{getText(related, "english")}</small>
            </Link>
          </li>
        ))}
      </ul>

      <p>
        <Link href={`/${language.slug}`}>See all phrases in {language.name}</Link>
      </p>

      <JsonLd data={audioJsonLd} />
    </>
  );
}
