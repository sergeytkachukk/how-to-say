import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>

      <p className="intro">We could not find this page. Try the home page and pick a phrase.</p>

      <p>
        <Link href="/">Go to the home page</Link>
      </p>
    </>
  );
}
