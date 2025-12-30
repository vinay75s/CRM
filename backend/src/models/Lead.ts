import mongoose, { Schema, Document, type ObjectId } from "mongoose";

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

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  budgetRange?: BudgetRange;
  classification: LeadClassification;
  voidReason?: VoidReason;
  customVoidReason?: string;
  assignedAgent?: mongoose.Types.ObjectId;
  isDuplicate: boolean;
  duplicateTag?: string;
  lastContactedAt?: Date;
  isConverted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    isConverted: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      default: LeadSource.Portal,
    },
    budgetRange: {
      type: String,
      enum: Object.values(BudgetRange),
    },
    classification: {
      type: String,
      enum: Object.values(LeadClassification),
      default: LeadClassification.Cold,
    },
    voidReason: {
      type: String,
      enum: VoidReason,
    },
    customVoidReason: {
      type: String,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateTag: {
      type: String,
    },
    lastContactedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Unique index for phone per user context
leadSchema.index(
  { phone: 1, assignedAgent: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model<ILead>("Lead", leadSchema);
