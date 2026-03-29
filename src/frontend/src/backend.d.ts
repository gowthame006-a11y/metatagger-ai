import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FeedbackStats {
    totalFeedback: bigint;
    helpfulCount: bigint;
    categoryCorrections: Array<[string, bigint]>;
}
export interface AnalysisResult {
    content: string;
    seoTags: Array<string>;
    suggestedTitle: string;
    confidenceScore: bigint;
    keywords: Array<string>;
    summary: string;
    timestamp: bigint;
    category: string;
    readTimeMinutes: bigint;
}
export interface FeedbackEntry {
    correctCategory: string;
    isHelpful: boolean;
    analysisTimestamp: bigint;
    correctedKeywords: Array<string>;
}
export interface UserProfile {
    name: string;
    createdAt: bigint;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    estimateAnalysisConfidence(text: string): Promise<bigint>;
    getAllUsersAnalysisCounts(): Promise<Array<[Principal, bigint]>>;
    getAnalysisCount(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeedbackStats(): Promise<FeedbackStats>;
    getHistory(): Promise<Array<AnalysisResult>>;
    getMostConfidentAnalysis(): Promise<AnalysisResult | null>;
    getMyFeedback(): Promise<Array<FeedbackEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAnalysis(content: string, seoTags: Array<string>, category: string, keywords: Array<string>, readTimeMinutes: bigint, summary: string, suggestedTitle: string, confidenceScore: bigint, timestamp: bigint): Promise<void>;
    submitFeedback(analysisTimestamp: bigint, isHelpful: boolean, correctCategory: string, correctedKeywords: Array<string>): Promise<void>;
}
