"use client";

import { useSyncExternalStore } from "react";
import { getEventHistory, getServerEventHistory, subscribeToEvents } from "@/lib/track";

const MAX_ROWS = 8;

export default function EventLog() {
  const history = useSyncExternalStore(subscribeToEvents, getEventHistory, getServerEventHistory);
  const events = history.slice(-MAX_ROWS).reverse();

  return (
    <section className="event-log" aria-labelledby="event-log-title">
      <h2 id="event-log-title">Live events</h2>

      <p className="event-log-note">
        Every event is pushed to <code>window.dataLayer</code>, so Google Tag Manager or GA4 can collect it.
      </p>

      {events.length === 0 ? (
        <p className="event-log-note">Nothing yet.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <time>{new Date(event.at).toLocaleTimeString()}</time>

              <strong>{event.name}</strong>

              <span>
                {Object.entries(event.params)
                  .map(([key, value]) => `${key}=${value}`)
                  .join(" ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
