/**
 * Aurora is now baked into `.bg-clay::before` as a single static gradient
 * for performance — no animation, no extra DOM. This component is kept as
 * a no-op so existing imports don't break.
 */
export function AuroraBackground() {
  return null;
}
