# MetaTagger AI

## Current State
The app has a Motoko backend storing analysis history and a frontend `analyzer.ts` with static heuristic rules for tagging, categorization, and confidence scoring. There is no user feedback loop or model improvement mechanism.

## Requested Changes (Diff)

### Add
- Backend: `FeedbackEntry` type to store user corrections (correct category, helpful flag, corrected keywords)
- Backend: `submitFeedback` function to save feedback tied to an analysis timestamp
- Backend: `getFeedbackStats` query returning aggregated category correction counts and helpfulness rates
- Frontend: `trainableAnalyzer.ts` — a learning layer that fetches feedback stats from backend and adjusts category keyword weights and confidence scoring dynamically
- Frontend: Feedback UI on ResultsPage — thumbs up/down and a "correct the category" dropdown
- Frontend: "Model Stats" panel on DashboardPage showing total training samples, top corrected categories, and current model accuracy estimate

### Modify
- `analyzer.ts` — export raw category weights so `trainableAnalyzer.ts` can override them
- `ResultsPage.tsx` — add feedback controls below each result
- `DashboardPage.tsx` — add a Model Stats card

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo` to add FeedbackEntry type, submitFeedback, and getFeedbackStats endpoints
2. Regenerate backend bindings (backend.d.ts)
3. Refactor `analyzer.ts` to export category weights map
4. Create `trainableAnalyzer.ts` that fetches stats and adjusts weights before analysis
5. Update `ResultsPage.tsx` with feedback UI (thumbs, category correction)
6. Update `DashboardPage.tsx` with Model Stats panel
