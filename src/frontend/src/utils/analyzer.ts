export interface AnalysisResult {
  seoTags: string[];
  category: string;
  keywords: string[];
  readTimeMinutes: number;
  summary: string;
  suggestedTitle: string;
  confidenceScore: number;
}

export const categoryKeywords: Record<string, string[]> = {
  Technology: [
    "software",
    "tech",
    "digital",
    "code",
    "programming",
    "computer",
    "data",
    "ai",
    "machine",
    "algorithm",
    "cloud",
    "api",
    "app",
    "web",
    "developer",
  ],
  Business: [
    "business",
    "company",
    "market",
    "revenue",
    "profit",
    "strategy",
    "customer",
    "sales",
    "growth",
    "startup",
    "entrepreneur",
    "investment",
    "brand",
  ],
  Health: [
    "health",
    "medical",
    "doctor",
    "patient",
    "disease",
    "treatment",
    "wellness",
    "fitness",
    "diet",
    "exercise",
    "mental",
    "therapy",
    "nutrition",
  ],
  Education: [
    "education",
    "learning",
    "student",
    "school",
    "university",
    "course",
    "teacher",
    "study",
    "knowledge",
    "skill",
    "training",
    "academic",
  ],
  Finance: [
    "finance",
    "money",
    "investment",
    "stock",
    "crypto",
    "bank",
    "loan",
    "tax",
    "budget",
    "economic",
    "financial",
    "trading",
    "portfolio",
  ],
  Lifestyle: [
    "lifestyle",
    "fashion",
    "travel",
    "food",
    "home",
    "family",
    "relationship",
    "personal",
    "hobby",
    "culture",
    "art",
    "music",
    "entertainment",
  ],
};

export function analyzeContent(
  text: string,
  customWeights?: Record<string, string[]>,
): AnalysisResult {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = words.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "shall",
    "can",
    "need",
    "dare",
    "ought",
    "used",
    "able",
    "it",
    "its",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "our",
    "their",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "so",
    "yet",
    "either",
    "neither",
    "once",
  ]);

  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  }
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((e) => e[0]);

  // Merge custom weights on top of base category keywords
  const mergedCategories: Record<string, string[]> = {};
  for (const [cat, words_] of Object.entries(categoryKeywords)) {
    mergedCategories[cat] = [...words_];
  }
  if (customWeights) {
    for (const [cat, extraWords] of Object.entries(customWeights)) {
      if (mergedCategories[cat]) {
        const existing = new Set(mergedCategories[cat]);
        for (const w of extraWords) {
          if (!existing.has(w)) mergedCategories[cat].push(w);
        }
      } else {
        mergedCategories[cat] = [...extraWords];
      }
    }
  }

  let bestCategory = "Other";
  let bestScore = 0;
  const textLower = text.toLowerCase();
  for (const [cat, catWords] of Object.entries(mergedCategories)) {
    const score = catWords.reduce(
      (sum, w) => sum + (textLower.split(w).length - 1),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  const tagBase = [...keywords];
  const catTags = mergedCategories[bestCategory] || [];
  for (const t of catTags) {
    if (!tagBase.includes(t) && tagBase.length < 12) tagBase.push(t);
  }
  const seoTags = tagBase
    .slice(0, 15)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));
  while (seoTags.length < 8) seoTags.push(`${bestCategory} Tips`);

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const summary =
    sentences.slice(0, 3).join(". ") + (sentences.length > 0 ? "." : "");

  const titleWords = keywords.slice(0, 4);
  const suggestedTitle =
    titleWords.length > 0
      ? `${titleWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}: A Complete Guide`
      : `Complete Guide to ${bestCategory}`;

  const density = (keywords.length / Math.max(wordCount, 1)) * 100;
  const lengthScore = Math.min(wordCount / 5, 50);
  const densityScore = Math.min(density * 3, 50);
  const confidenceScore = Math.round(Math.min(lengthScore + densityScore, 100));

  return {
    seoTags,
    category: bestCategory,
    keywords,
    readTimeMinutes,
    summary,
    suggestedTitle,
    confidenceScore,
  };
}
