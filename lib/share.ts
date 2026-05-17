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
