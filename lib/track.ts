/**
 * Typed wrappers around Plausible custom-event tracking.
 * No-ops if Plausible isn't loaded (dev / blocked).
 */

type PlausibleProps = Record<string, string | number | boolean>;

interface PlausibleFn {
  (event: string, options?: { props?: PlausibleProps }): void;
  q?: unknown[];
}

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

function send(event: string, props?: PlausibleProps) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(event, props ? { props } : undefined);
}

export const track = {
  /** A user answered a quiz question */
  quizAnswer: (questionId: string, answerId: string) =>
    send("Quiz Answer", { questionId, answerId }),
  /** A user landed on the result page */
  quizComplete: (topSlug: string, score: number) =>
    send("Quiz Complete", { topBreed: topSlug, score }),
  /** A user clicked a persona on the picker */
  personaPicked: (personaId: string) =>
    send("Persona Picked", { persona: personaId }),
  /** A user opened a breed detail page */
  breedView: (slug: string) => send("Breed View", { breed: slug }),
  /** A user toggled favorite on a breed */
  favoriteToggle: (slug: string, nowFavorite: boolean) =>
    send("Favorite Toggle", { breed: slug, added: nowFavorite }),
  /** A user asked the AI chat */
  aiAsk: (slug: string) => send("AI Ask", { breed: slug }),
  /** A user shared the result */
  share: (method: "whatsapp" | "copy" | "native" | "pdf") =>
    send("Share Result", { method }),
  /** A user clicked an adoption link */
  adoptionClick: (provider: string, breed: string) =>
    send("Adoption Link", { provider, breed }),
};
