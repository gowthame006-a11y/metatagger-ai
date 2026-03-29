import type { FeedbackEntry } from "../backend.d";
import { analyzeContent, categoryKeywords } from "./analyzer";
import type { AnalysisResult } from "./analyzer";

/**
 * Builds a custom weights map from the user's feedback history.
 * For each correction (correctCategory + correctedKeywords), those keywords
 * are added to that category's word list — teaching the model which words
 * belong where based on real user input.
 */
export function loadModelWeights(
  myFeedback: FeedbackEntry[],
): Record<string, string[]> {
  const weights: Record<string, string[]> = {};

  for (const entry of myFeedback) {
    const cat = entry.correctCategory;
    if (!cat || cat === "Other") continue;

    // Add corrected keywords to the category
    if (entry.correctedKeywords.length > 0) {
      if (!weights[cat]) weights[cat] = [];
      for (const kw of entry.correctedKeywords) {
        const clean = kw.trim().toLowerCase();
        if (clean.length > 2 && !weights[cat].includes(clean)) {
          weights[cat].push(clean);
        }
      }
    } else {
      // Even without explicit keywords, seed the category so it's recognized
      if (!weights[cat]) weights[cat] = [];
      // Add generic signal words from the base category if not already tracked
      const baseWords = categoryKeywords[cat] || [];
      for (const w of baseWords.slice(0, 3)) {
        if (!weights[cat].includes(w)) weights[cat].push(w);
      }
    }
  }

  return weights;
}

/**
 * Returns accuracy percentage (0-100) based on helpful / total feedback ratio.
 */
export function getModelAccuracy(myFeedback: FeedbackEntry[]): number {
  if (!myFeedback.length) return 0;
  const helpful = myFeedback.filter((f) => f.isHelpful).length;
  return Math.round((helpful / myFeedback.length) * 100);
}

/**
 * Runs analysis with weights learned from user feedback.
 */
export function trainedAnalyzeContent(
  text: string,
  myFeedback: FeedbackEntry[],
): AnalysisResult {
  const customWeights = loadModelWeights(myFeedback);
  return analyzeContent(text, customWeights);
}
