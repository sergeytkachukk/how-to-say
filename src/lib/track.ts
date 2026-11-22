import { getVariant } from "./experiment";

export type TrackParams = Record<string, string | number | boolean>;

export type TrackedEvent = {
  id: number;
  name: string;
  params: TrackParams;
  at: number;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const TRACK_EVENT_NAME = "how-to-say:track";

// The panel is mounted after the first page_view, so we keep the history for it.
let eventHistory: TrackedEvent[] = [];
const noEvents: TrackedEvent[] = [];

export function getEventHistory(): TrackedEvent[] {
  return eventHistory;
}

export function getServerEventHistory(): TrackedEvent[] {
  return noEvents;
}

export function subscribeToEvents(onChange: () => void): () => void {
  window.addEventListener(TRACK_EVENT_NAME, onChange);
  return () => window.removeEventListener(TRACK_EVENT_NAME, onChange);
}

export function trackEvent(name: string, params: TrackParams = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  const allParams = { ...params, variant: getVariant() };
  window.dataLayer.push({ event: name, ...allParams });

  const event: TrackedEvent = { id: eventHistory.length + 1, name, params: allParams, at: Date.now() };
  eventHistory = [...eventHistory, event];
  window.dispatchEvent(new CustomEvent<TrackedEvent>(TRACK_EVENT_NAME, { detail: event }));
}
