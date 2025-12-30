export enum LeadSource {
  Portal = "Portal",
  Website = "Website",
  Referral = "Referral",
  Social = "Social",
  WalkIn = "Walk-in",
}

export enum BudgetRange {
  Below50L = "<50L",
  Range50to75L = "50-75L",
  Range75LtoCr = "75L-1Cr",
  Above1Cr = "1Cr+",
}

export enum LeadClassification {
  Cold = "Cold",
  Warm = "Warm",
  Hot = "Hot",
  Void = "Void",
}

export enum VoidReason {
  BudgetMismatch = "BUDGET_MISMATCH",
  LocationIssue = "LOCATION_ISSUE",
  JunkLead = "JUNK_LEAD",
  NotInterested = "NOT_INTERESTED",
  Other = "OTHER",
}

export enum Role {
  Admin = "admin",
  SalesAgent = "sales_agent",
  Developer = "developer",
}
