import type { Metadata } from "next";
import Link from "next/link";
import { getPhraseUrl, getText, languages, phrases } from "@/lib/phrases";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HubPage() {
  return (
    <>
      <h1>How to say common phrases</h1>
      <p className="intro">
        Pick a language to see all phrases, or pick a phrase to hear it in Italian, Ukrainian and German.
      </p>

      <h2>Languages</h2>
      <ul className="link-list">
        {languages.map((language) => (
          <li key={language.slug}>
            <Link href={`/${language.slug}`}>{language.name}</Link>
          </li>
        ))}
      </ul>

      <h2>Phrases</h2>
      <ul className="link-list">
        {phrases.map((phrase) => (
          <li key={phrase.slug}>
            <Link href={getPhraseUrl(phrase, "english")}>{getText(phrase, "english")}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
