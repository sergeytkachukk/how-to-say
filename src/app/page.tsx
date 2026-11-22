import type { Metadata } from "next";
import PageView from "@/components/PageView";
import TrackedLink from "@/components/TrackedLink";
import { getPhraseUrl, getText, languages, phrases } from "@/lib/phrases";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HubPage() {
  return (
    <>
      <PageView params={{ page_type: "hub" }} />

      <h1>How to say common phrases</h1>

      <p className="intro">
        Pick a language to see all phrases, or pick a phrase to hear it in Italian, Ukrainian and German.
      </p>

      <h2>Languages</h2>

      <ul className="link-list">
        {languages.map((language) => (
          <li key={language.slug}>
            <TrackedLink href={`/${language.slug}`} linkType="hub_language">{language.name}</TrackedLink>
          </li>
        ))}
      </ul>

      <h2>Phrases</h2>

      <ul className="link-list">
        {phrases.map((phrase) => (
          <li key={phrase.slug}>
            <TrackedLink href={getPhraseUrl(phrase, "english")} linkType="hub_phrase">{getText(phrase, "english")}</TrackedLink>
          </li>
        ))}
      </ul>
    </>
  );
}
