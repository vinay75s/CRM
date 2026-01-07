import { Types } from "mongoose";

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Shortlisted = "Shortlisted",
  SiteVisit = "Site Visit",
  Negotiation = "Negotiation",
  Booked = "Booked",
  Lost = "Lost",
  Converted = "Converted",
}

export interface LeadDocument {
  // CUSTOMER DATA - Basic Info
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  homeCountry?: string;
  taxResidencyCountry?: string;
  visaResidencyStatus?: string;
  leadSource?: string;
  ageYears?: number;
  profession?: string;
  householdSize?: string;
  householdIncomeBandInr?: string;
  priorPropertiesPurchased?: string;
  propertyRolePrimary?: string[];
  searchTrigger?: string[];
  buyingJourneyStage?: string;
  explorationDuration?: string;
  purchaseTimeline?: string;
  totalBudgetBandInr?: string;

  // CUSTOMER DATA - Notes
  propertyVisionNotes?: string;
  aboutYouNotes?: string;
  ownershipTimelineNotes?: string;
  locationDealbreakerNotes?: string;
  finalNotes?: string;

  // CUSTOMER DATA - Current Home
  currentHomeCity?: string;
  currentHomeState?: string;
  currentHomeCountry?: string;

  // LOCATION/CITY DATA
  buyingCountryFocus?: string;
  targetStatesRegions?: string[];
  climateRiskAvoidance?: string[];
  targetLocations?: string[];
  preferredClimate?: string[];
  locationPriorities?: string[];
  areaTypePreference?: string[];
  naturalFeatureClosest?: string[];

  // PROPERTY DATA
  strPermissionImportance?: string;
  assetTypeInterest?: string[];
  farmlandWaterSourcePreference?: string;
  unitConfiguration?: string[];
  farmlandLandSizeBucket?: string[];
  ownershipStructurePreference?: string;
  possessionStagePreference?: string;
  possessionTimelineBucket?: string;
  managementModelPreference?: string;
  fundingPreference?: string;
  communityFormatPreference?: string;
  communityFriendlyFor?: string[];
  communityOutdoorAmenitiesTop?: string[];
  vastuPreferredDirections?: string[];
  furnishingLevelPreference?: string;
  homeMustHaveFeatures?: string[];
  homeNiceToHaveFeatures?: string[];
  interiorFinishLevel?: string;
  smartHomeSecurityFeatures?: string[];
  privateOutdoorFeatures?: string[];
  idealHomeNotes?: string;

  // SYSTEM
  system?: {
    leadStatus?: LeadStatus;
    assignedAgent?: Types.ObjectId;
    priorityScore?: number;
    investmentScore?: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
