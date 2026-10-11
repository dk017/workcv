// The AI tools accept limited input (for example 2,000 characters of CV evidence and 5,000 of
// job advert), but a full CV or a pasted advert can be much longer. These keep the editor's
// requests within those limits instead of letting the tool reject them.

export const aiLimits = {
  summaryBackground: 2_000,
  summaryEvidence: 2_000,
  bulletNotes: 3_000,
  jobDescription: 5_000,
} as const;

/** Shortens one line at a word break so it fits in `max` characters. */
function cutAtWord(line: string, max: number) {
  if (line.length <= max) return line;
  const cut = line.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd();
}

/** Whole lines of `text`, in order, up to `max` characters. Earlier lines come first, so put
 * the most useful evidence (skills, then the most recent roles) at the start. */
export function fitLines(text: string, max: number) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const kept: string[] = [];
  let length = 0;
  for (const line of lines) {
    const next = kept.length ? length + 1 + line.length : line.length;
    if (next <= max) {
      kept.push(line);
      length = next;
      continue;
    }
    // The first line alone is too long: keep as much of it as fits.
    if (!kept.length) kept.push(cutAtWord(line, max));
    break;
  }
  return kept.join("\n");
}

/** A job advert shortened to `max` characters at a line break, or failing that a sentence or
 * word break. Duties and essential criteria usually come first in UK adverts. */
export function fitAdvert(text: string, max: number = aiLimits.jobDescription) {
  const advert = text.trim();
  if (advert.length <= max) return advert;
  const cut = advert.slice(0, max);
  const lineBreak = cut.lastIndexOf("\n");
  if (lineBreak > max * 0.6) return cut.slice(0, lineBreak).trimEnd();
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cutAtWord(cut, max);
}
