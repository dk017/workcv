// Pure bullet-point rules shared by the server-side generators and the editor.
// Keep this file free of server-only imports so client components can use it.

export const personalPronouns =
  /\b(i|i'm|i’ve|i'd|me|my|mine|we|we're|we’ve|our|ours|he|she|him|her|his|hers|they|them|their|theirs)\b/i;
export const weakOpening = /^(responsible for|duties included|worked on|helped with|tasked with)\b/i;
export const emptyCliches =
  /\b(passionate|hard[- ]working|results[- ]driven|dynamic professional|go[- ]getter|excellent communication skills|team player)\b/i;

export function countWords(value: string) {
  return value.trim().match(/\b[A-Za-z0-9][A-Za-z0-9'’-]*\b/g)?.length ?? 0;
}

export function numericTokens(value: string) {
  return new Set(value.match(/(?:£\s*)?\b\d+(?:[.,]\d+)?%?\b/g) ?? []);
}

export function normalise(value: string) {
  return value.toLocaleLowerCase("en-GB").replace(/[^a-z0-9]+/g, " ").trim();
}

export function cleanBullet(value: string) {
  return value
    .trim()
    .replace(/^(?:[-*•]|\d+[.)])\s*/, "")
    .replace(/[.;]\s*$/, "");
}

export function hasOutcome(value: string) {
  return /(?:£\s*)?\b\d+(?:[.,]\d+)?%?\b|\b(?:increased|reduced|improved|saved|grew|delivered|resolved|achieved|exceeded|cut|raised|enabled|resulting|leading to)\b/i.test(
    value,
  );
}

/**
 * Short, user-facing reasons an existing bullet reads as weak. An empty list
 * means the bullet passes. Blank bullets are ignored.
 */
export function assessExistingBullet(rawBullet: string): string[] {
  const bullet = cleanBullet(rawBullet);
  if (!bullet) return [];

  const reasons: string[] = [];
  const words = countWords(bullet);
  if (words < 5) reasons.push("Too short to show what you did");
  if (words > 32) reasons.push("Too long, so recruiters will skim it");
  if (weakOpening.test(bullet)) reasons.push("Opens with a weak phrase, not an action verb");
  if (personalPronouns.test(bullet)) reasons.push("Uses I, we or my");
  if (emptyCliches.test(bullet)) reasons.push("Contains a generic CV cliché");
  if (words >= 5 && !hasOutcome(bullet)) reasons.push("No result or number");
  return reasons;
}
