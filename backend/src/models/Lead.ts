import mongoose, { Schema } from "mongoose";
import { LeadStatus, type LeadDocument } from "../types/lead.types.js";

const leadSchema = new Schema<LeadDocument>(
  {
    // CUSTOMER DATA - Basic Info
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    homeCountry: { type: String },
    taxResidencyCountry: { type: String },
    visaResidencyStatus: { type: String },
    leadSource: { type: String },
    ageYears: { type: Number },
    profession: { type: String },
    householdSize: { type: String },
    householdIncomeBandInr: { type: String },
    priorPropertiesPurchased: { type: String },
    propertyRolePrimary: { type: [String], default: [] },
    searchTrigger: { type: [String], default: [] },
    buyingJourneyStage: { type: String },
    explorationDuration: { type: String },
    purchaseTimeline: { type: String },
    totalBudgetBandInr: { type: String },

    // CUSTOMER DATA - Notes
    propertyVisionNotes: { type: String },
    aboutYouNotes: { type: String },
    ownershipTimelineNotes: { type: String },
    locationDealbreakerNotes: { type: String },
    finalNotes: { type: String },

    // CUSTOMER DATA - Current Home
    currentHomeCity: { type: String },
    currentHomeState: { type: String },
    currentHomeCountry: { type: String },

    // LOCATION/CITY DATA
    buyingCountryFocus: { type: String },
    targetStatesRegions: { type: [String], default: [] },
    climateRiskAvoidance: { type: [String], default: [] },
    targetLocations: { type: [String], default: [] },
    preferredClimate: { type: [String], default: [] },
    locationPriorities: { type: [String], default: [] },
    areaTypePreference: { type: [String], default: [] },
    naturalFeatureClosest: { type: [String], default: [] },

    // PROPERTY DATA
    strPermissionImportance: { type: String },
    assetTypeInterest: { type: [String], default: [] },
    farmlandWaterSourcePreference: { type: String },
    unitConfiguration: { type: [String], default: [] },
    farmlandLandSizeBucket: { type: [String], default: [] },
    ownershipStructurePreference: { type: String },
    possessionStagePreference: { type: String },
    possessionTimelineBucket: { type: String },
    managementModelPreference: { type: String },
    fundingPreference: { type: String },
    communityFormatPreference: { type: String },
    communityFriendlyFor: { type: [String], default: [] },
    communityOutdoorAmenitiesTop: { type: [String], default: [] },
    vastuPreferredDirections: { type: [String], default: [] },
    furnishingLevelPreference: { type: String },
    homeMustHaveFeatures: { type: [String], default: [] },
    homeNiceToHaveFeatures: { type: [String], default: [] },
    interiorFinishLevel: { type: String },
    smartHomeSecurityFeatures: { type: [String], default: [] },
    privateOutdoorFeatures: { type: [String], default: [] },
    idealHomeNotes: { type: String },

    // SYSTEM
    system: {
      leadStatus: {
        type: String,
        enum: Object.values(LeadStatus),
        default: LeadStatus.New,
      },
      assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      priorityScore: { type: Number, default: 0 },
      investmentScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Indexes for search and filtering
leadSchema.index({ email: 1 });
leadSchema.index({ "system.assignedAgent": 1 });
leadSchema.index({ "system.leadStatus": 1 });

export const Lead = mongoose.model<LeadDocument>("Lead", leadSchema);
