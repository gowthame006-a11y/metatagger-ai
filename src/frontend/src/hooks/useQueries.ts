import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisResult, FeedbackEntry, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalysisResult[]>({
    queryKey: ["analysisHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedbackEntry[]>({
    queryKey: ["myFeedback"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      analysisTimestamp: bigint;
      isHelpful: boolean;
      correctCategory: string;
      correctedKeywords: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitFeedback(
        params.analysisTimestamp,
        params.isHelpful,
        params.correctCategory,
        params.correctedKeywords,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFeedback"] });
    },
  });
}

export function useSubmitAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      content: string;
      seoTags: string[];
      category: string;
      keywords: string[];
      readTimeMinutes: number;
      summary: string;
      suggestedTitle: string;
      confidenceScore: number;
      timestamp: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAnalysis(
        params.content,
        params.seoTags,
        params.category,
        params.keywords,
        BigInt(params.readTimeMinutes),
        params.summary,
        params.suggestedTitle,
        BigInt(params.confidenceScore),
        params.timestamp,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisHistory"] });
    },
  });
}
