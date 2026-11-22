"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/track";

export default function TrackedLink({
  href,
  linkType,
  children,
}: {
  href: string;
  linkType: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link href={href} onClick={() => trackEvent("next_page", { from: pathname, to: href, link_type: linkType })}>
      {children}
    </Link>
  );
}
