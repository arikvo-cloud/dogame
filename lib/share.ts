import type { AnswerMap } from "@/lib/quiz/types";

/** Build a WhatsApp deep link with the given text. */
export function whatsappLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Copy a string to clipboard. Returns true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Build the result-share text in Hebrew. */
export function buildShareText(topBreedName: string, score: number): string {
  return (
    `מצאתי את הכלב שמתאים לי ב-DoGame! 🐾\n` +
    `הגזע המוביל: ${topBreedName} (${score}% התאמה)\n\n` +
    `בדוק את ההתאמה שלך:`
  );
}

/**
 * Encode quiz answers into a URL-safe base64 string for shareable links.
 * Result is short (~80-150 chars for a full quiz).
 */
export function encodeAnswers(answers: AnswerMap): string {
  const json = JSON.stringify(answers);
  if (typeof window === "undefined") {
    // Server-side: not used here but a safe fallback.
    return Buffer.from(json, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  // URL-safe base64: standard atob with replacements
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Inverse of `encodeAnswers`. Returns null on parse failure. */
export function decodeAnswers(token: string): AnswerMap | null {
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const b64 = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const json =
      typeof window === "undefined"
        ? Buffer.from(b64, "base64").toString("utf-8")
        : decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as AnswerMap;
  } catch {
    return null;
  }
}

/** Build a shareable result URL containing encoded answers. */
export function buildShareUrl(answers: AnswerMap, origin: string): string {
  const token = encodeAnswers(answers);
  return `${origin}/result/?q=${token}`;
}
