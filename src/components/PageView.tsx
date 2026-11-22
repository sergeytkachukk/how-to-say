"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type TrackParams } from "@/lib/track";

export default function PageView({ params }: { params: TrackParams }) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    trackEvent("page_view", params);
  }, [params]);

  return null;
}
