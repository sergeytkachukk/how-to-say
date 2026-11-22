"use client";

import { useState } from "react";
import { trackEvent, type TrackParams } from "@/lib/track";

export default function CopyButton({ text, params }: { text: string; params: TrackParams }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    trackEvent("copy_phrase", params);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="copy-button" onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
