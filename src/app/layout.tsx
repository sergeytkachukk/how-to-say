import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import EventLog from "@/components/EventLog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "How to say common phrases in Italian, Ukrainian and German",
    template: `%s | ${SITE_NAME}`,
  },
  description: "Learn how to say everyday phrases in Italian, Ukrainian and German. Read the phrase and listen to it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="site-name">
              {SITE_NAME}
            </Link>
          </div>
        </header>

        <main>
          {children}

          <EventLog />
        </main>

        <footer className="site-footer">A demo site. Audio made with ElevenLabs.</footer>
      </body>
    </html>
  );
}
