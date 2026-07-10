export type ReadabilitySentence = { text: string; wordCount: number; isLong: boolean; mayBePassive: boolean };
export type ReadabilityAnalysis = {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  fleschReadingEase: number;
  label: "Easy to scan" | "Generally clear" | "Fairly difficult" | "Difficult";
  longSentenceCount: number;
  passiveSentenceCount: number;
  sentences: ReadabilitySentence[];
};
export type KeywordTerm = { term: string; count: number; density: number };
export type KeywordDensityAnalysis = {
  wordCount: number;
  uniqueWordRatio: number;
  repeatedTerms: KeywordTerm[];
  repeatedPhrases: KeywordTerm[];
  overusedPhrases: string[];
};

const stopWords = new Set("a an and are as at be been being but by can could did do does doing for from had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not of on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves".split(" "));
const vagueTerms = ["responsible for", "duties included", "various tasks", "excellent communication", "team player", "hard working", "worked on", "helped with"];

export function cvWords(value: string) {
  return value.match(/(?:C\+\+|C#|\.NET|\.?[A-Za-z0-9]+(?:[.'’+#/-][A-Za-z0-9]+)*)/gi) ?? [];
}

function sentenceParts(value: string) {
  return value.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) ?? [];
}

function syllables(word: string) {
  const clean = word.toLocaleLowerCase("en-GB").replace(/[^a-z]/g, "");
  if (clean.length <= 3) return clean ? 1 : 0;
  const adjusted = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "").replace(/^y/, "");
  return Math.max(1, adjusted.match(/[aeiouy]{1,2}/g)?.length ?? 1);
}

function round(value: number, places = 1) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function analyseCvReadability(value: string): ReadabilityAnalysis {
  const parts = sentenceParts(value);
  const allWords = cvWords(value);
  const totalSyllables = allWords.reduce((total, word) => total + syllables(word), 0);
  const sentenceCount = Math.max(1, parts.length);
  const rawScore = allWords.length ? 206.835 - 1.015 * (allWords.length / sentenceCount) - 84.6 * (totalSyllables / allWords.length) : 0;
  const score = round(Math.max(0, Math.min(100, rawScore)));
  const sentences = parts.map((text) => {
    const wordCount = cvWords(text).length;
    return { text, wordCount, isLong: wordCount > 25, mayBePassive: /\b(?:am|is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i.test(text) };
  });
  const label = score >= 70 ? "Easy to scan" : score >= 55 ? "Generally clear" : score >= 40 ? "Fairly difficult" : "Difficult";
  return { wordCount: allWords.length, sentenceCount: parts.length, averageSentenceLength: allWords.length ? round(allWords.length / sentenceCount) : 0, fleschReadingEase: score, label, longSentenceCount: sentences.filter((item) => item.isLong).length, passiveSentenceCount: sentences.filter((item) => item.mayBePassive).length, sentences };
}

function termDensity(count: number, total: number, termWords = 1) {
  return total ? round((count * termWords * 100) / total, 2) : 0;
}

export function analyseCvKeywordDensity(value: string): KeywordDensityAnalysis {
  const tokens = cvWords(value).map((word) => word.toLocaleLowerCase("en-GB").replace(/^[.'’/-]+|[.'’/-]+$/g, "")).filter(Boolean);
  const meaningful = tokens.filter((token) => !stopWords.has(token) && (token.length > 1 || /^(c|r)$/.test(token)) && !/^\d+$/.test(token));
  const counts = new Map<string, number>();
  meaningful.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  const repeatedTerms = Array.from(counts.entries()).filter(([, count]) => count >= 2).map(([term, count]) => ({ term, count, density: termDensity(count, tokens.length) })).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)).slice(0, 20);

  const phraseCounts = new Map<string, number>();
  for (let size = 2; size <= 3; size += 1) {
    for (let index = 0; index <= tokens.length - size; index += 1) {
      const phraseTokens = tokens.slice(index, index + size);
      if (phraseTokens.some((token) => stopWords.has(token)) || phraseTokens.every((token) => /^\d+$/.test(token))) continue;
      const phrase = phraseTokens.join(" ");
      phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
    }
  }
  const repeatedPhrases = Array.from(phraseCounts.entries()).filter(([, count]) => count >= 2).map(([term, count]) => ({ term, count, density: termDensity(count, tokens.length, term.split(" ").length) })).sort((a, b) => b.count - a.count || b.term.split(" ").length - a.term.split(" ").length).slice(0, 12);
  const lower = value.toLocaleLowerCase("en-GB").replace(/[-–—]/g, " ");
  return { wordCount: tokens.length, uniqueWordRatio: meaningful.length ? round((new Set(meaningful).size * 100) / meaningful.length) : 0, repeatedTerms, repeatedPhrases, overusedPhrases: vagueTerms.filter((term) => lower.includes(term)) };
}
