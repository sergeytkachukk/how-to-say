// A small home-made feature flag for one A/B test.
// Test: does the label "Hear it" get more plays than "Listen"?
// The variant is chosen at random once and saved in the browser, so a visitor always sees the same label.
// Add ?variant=A or ?variant=B to the address to force a variant.

export type Variant = "A" | "B";

export const EXPERIMENT_NAME = "play_button_label";

const STORAGE_KEY = "how-to-say:variant";

export const BUTTON_LABELS: Record<Variant, string> = {
  A: "▶ Listen",
  B: "▶ Hear it",
};

function isVariant(value: unknown): value is Variant {
  return value === "A" || value === "B";
}

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function save(variant: Variant): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // Storage can be blocked in private mode. The page still works.
  }
}

function chooseVariant(): Variant {
  const forced = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
  if (isVariant(forced)) {
    save(forced);
    return forced;
  }

  const saved = readSaved();
  if (isVariant(saved)) return saved;

  const random: Variant = Math.random() < 0.5 ? "A" : "B";
  save(random);
  return random;
}

let cachedVariant: Variant | null = null;

// Browser only. Gives the same answer every time during one visit.
export function getVariant(): Variant {
  cachedVariant ??= chooseVariant();
  return cachedVariant;
}

export function getServerVariant(): null {
  return null;
}

export function subscribeToVariant(): () => void {
  return () => {};
}
