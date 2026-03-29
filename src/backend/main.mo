import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // User Profile Type
  public type UserProfile = {
    email : Text;
    name : Text;
    createdAt : Nat;
  };

  // Analysis Result Type
  public type AnalysisResult = {
    content : Text;
    seoTags : [Text];
    category : Text;
    keywords : [Text];
    readTimeMinutes : Nat;
    summary : Text;
    suggestedTitle : Text;
    confidenceScore : Nat;
    timestamp : Nat;
  };

  type FeedbackEntry = {
    analysisTimestamp : Nat;
    isHelpful : Bool;
    correctCategory : Text;
    correctedKeywords : [Text];
  };

  type FeedbackStats = {
    totalFeedback : Nat;
    helpfulCount : Nat;
    categoryCorrections : [(Text, Nat)];
  };

  // Store Data Persistently
  let userProfiles = Map.empty<Principal, UserProfile>();
  let analysisHistory = Map.empty<Principal, [AnalysisResult]>();
  let feedbackStore = Map.empty<Principal, [FeedbackEntry]>();

  // Initialize authentication system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Analysis Workflow
  public shared ({ caller }) func submitAnalysis(
    content : Text,
    seoTags : [Text],
    category : Text,
    keywords : [Text],
    readTimeMinutes : Nat,
    summary : Text,
    suggestedTitle : Text,
    confidenceScore : Nat,
    timestamp : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to submit content for analysis");
    };
    let result : AnalysisResult = {
      content = content;
      seoTags = seoTags;
      category = category;
      keywords = keywords;
      readTimeMinutes = readTimeMinutes;
      summary = summary;
      suggestedTitle = suggestedTitle;
      confidenceScore = confidenceScore;
      timestamp;
    };

    switch (analysisHistory.get(caller)) {
      case (?history) {
        analysisHistory.add(caller, history.concat([result]));
      };
      case (null) {
        analysisHistory.add(caller, [result]);
      };
    };
  };

  public query ({ caller }) func getHistory() : async [AnalysisResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to retrieve your analysis history");
    };
    switch (analysisHistory.get(caller)) {
      case (?history) { history };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func estimateAnalysisConfidence(text : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can analyze content");
    };
    if (text.size() == 0) {
      Runtime.trap("Text cannot be empty");
    };

    // Simple confidence estimation based on text length
    let baseScore = Nat.min(100, text.size() / 10);
    baseScore;
  };

  public query ({ caller }) func getMostConfidentAnalysis() : async ?AnalysisResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to retrieve analysis results");
    };

    switch (analysisHistory.get(caller)) {
      case (null) { null };
      case (?history) {
        if (history.size() == 0) {
          return null;
        };

        var maxConfidence = 0;
        var bestResult : ?AnalysisResult = null;

        for (result in history.values()) {
          if (result.confidenceScore > maxConfidence) {
            maxConfidence := result.confidenceScore;
            bestResult := ?result;
          };
        };

        bestResult;
      };
    };
  };

  public query ({ caller }) func getAnalysisCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to retrieve analysis count");
    };

    switch (analysisHistory.get(caller)) {
      case (null) { 0 };
      case (?history) { history.size() };
    };
  };

  public query ({ caller }) func getAllUsersAnalysisCounts() : async [(Principal, Nat)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users' data");
    };

    analysisHistory.entries().map(
      func((principal, history)) { (principal, history.size()) }
    ).toArray();
  };

  // Feedback System Functions
  public shared ({ caller }) func submitFeedback(
    analysisTimestamp : Nat,
    isHelpful : Bool,
    correctCategory : Text,
    correctedKeywords : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to submit feedback");
    };

    let feedbackEntry : FeedbackEntry = {
      analysisTimestamp;
      isHelpful;
      correctCategory;
      correctedKeywords;
    };

    switch (feedbackStore.get(caller)) {
      case (?entries) {
        feedbackStore.add(caller, entries.concat([feedbackEntry]));
      };
      case (null) {
        feedbackStore.add(caller, [feedbackEntry]);
      };
    };
  };

  public query ({ caller }) func getFeedbackStats() : async FeedbackStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view system-wide feedback statistics");
    };

    var totalFeedback = 0;
    var helpfulCount = 0;
    let categoryMap = Map.empty<Text, Nat>();

    for ((_, entries) in feedbackStore.entries()) {
      totalFeedback += entries.size();

      for (feedback in entries.values()) {
        if (feedback.isHelpful) {
          helpfulCount += 1;
        };

        switch (categoryMap.get(feedback.correctCategory)) {
          case (?count) {
            categoryMap.add(feedback.correctCategory, count + 1);
          };
          case (null) {
            categoryMap.add(feedback.correctCategory, 1);
          };
        };
      };
    };

    {
      totalFeedback;
      helpfulCount;
      categoryCorrections = categoryMap.toArray();
    };
  };

  public query ({ caller }) func getMyFeedback() : async [FeedbackEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to retrieve your feedback entries");
    };
    switch (feedbackStore.get(caller)) {
      case (?entries) { entries };
      case (null) { [] };
    };
  };
};
