import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getLanguage, getPhraseUrl, getText, languages, phrases } from "@/lib/phrases";

type Props = { params: Promise<{ language: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((language) => ({ language: language.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language: languageSlug } = await params;
  const language = getLanguage(languageSlug);
  if (!language) return {};

  return {
    title: `Common phrases in ${language.name}`,
    description: `${phrases.length} everyday phrases in ${language.name}. Read each phrase and listen to how it sounds.`,
    alternates: { canonical: `/${language.slug}` },
  };
}

export default async function LanguagePage({ params }: Props) {
  const { language: languageSlug } = await params;
  const language = getLanguage(languageSlug);
  if (!language) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: language.name, url: `/${language.slug}` },
        ]}
      />
      <h1>Common phrases in {language.name}</h1>

      <ul className="phrase-list">
        {phrases.map((phrase) => (
          <li key={phrase.slug}>
            <Link href={getPhraseUrl(phrase, language.slug)}>
              <span lang={language.code}>{getText(phrase, language.slug)}</span>
              {language.slug !== "english" && <small>{getText(phrase, "english")}</small>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
