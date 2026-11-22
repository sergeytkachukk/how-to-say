import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageView from "@/components/PageView";
import TrackedLink from "@/components/TrackedLink";
import CopyButton from "@/components/CopyButton";
import AudioPlayer from "@/components/AudioPlayer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import {
  getAudioPath,
  getPhrase,
  getPhraseUrl,
  getRelatedPhrases,
  getText,
  phrases,
  translationLanguages,
} from "@/lib/phrases";

type Props = { params: Promise<{ phrase: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return phrases.map((phrase) => ({ phrase: phrase.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phrase: phraseSlug } = await params;
  const phrase = getPhrase(phraseSlug);
  if (!phrase) return {};

  const english = getText(phrase, "english");
  const names = translationLanguages.map((language) => language.name).join(", ");

  return {
    title: `How to say "${english}" in other languages`,
    description: `Learn how to say "${english}" in ${names}. Listen to the English audio and open the translations.`,
    alternates: { canonical: getPhraseUrl(phrase, "english") },
  };
}

export default async function EnglishPhrasePage({ params }: Props) {
  const { phrase: phraseSlug } = await params;
  const phrase = getPhrase(phraseSlug);
  if (!phrase) notFound();

  const english = getText(phrase, "english");
  const pageUrl = getPhraseUrl(phrase, "english");
  const eventParams = { phrase: phrase.slug, language: "english" };

  const audioJsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: `"${english}" in English`,
    description: `The English phrase "${english}" read aloud.`,
    contentUrl: `${SITE_URL}${getAudioPath(phrase, "english")}`,
    encodingFormat: "audio/mpeg",
    inLanguage: "en",
  };

  return (
    <>
      <PageView params={{ page_type: "phrase", ...eventParams }} />

      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "English", url: "/english" },
          { name: english, url: pageUrl },
        ]}
      />

      <h1>How to say &quot;{english}&quot; in other languages</h1>

      <div className="phrase-card">
        <p className="big-phrase" lang="en">
          {english}
        </p>

        <AudioPlayer src={getAudioPath(phrase, "english")} label={`Listen to ${english} in English`} params={eventParams} />

        <CopyButton text={english} params={eventParams} />
      </div>

      <h2>{english} in other languages</h2>

      <ul className="phrase-list">
        {translationLanguages.map((language) => (
          <li key={language.slug}>
            <TrackedLink href={getPhraseUrl(phrase, language.slug)} linkType="other_language">
              <span lang={language.code}>{getText(phrase, language.slug)}</span>

              <small>{language.name}</small>
            </TrackedLink>
          </li>
        ))}
      </ul>

      <h2>Related phrases</h2>

      <ul className="link-list">
        {getRelatedPhrases(phrase).map((related) => (
          <li key={related.slug}>
            <TrackedLink href={getPhraseUrl(related, "english")} linkType="related_phrase">{getText(related, "english")}</TrackedLink>
          </li>
        ))}
      </ul>

      <JsonLd data={audioJsonLd} />
    </>
  );
}
