import Lead, {
  BudgetRange,
  LeadClassification,
  LeadSource,
  VoidReason,
} from "@/models/Lead.js";
import User, { Role } from "@/models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGODB_URI; // change if needed
if (MONGO_URI == undefined) {
  console.log(" monot url is undefined");
  process.exit(1);
}
async function seed() {
  try {
    console.log("🌱 Connecting to database...");
    await mongoose.connect(MONGO_URI!);

    console.log("🧹 Clearing old data...");
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log("👤 Creating users...");
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@avacasa.com",
        password: "Admin@123",
        role: Role.Admin,
      },
      {
        name: "Rohit Sharma",
        email: "rohit@avacasa.com",
        password: "Agent@123",
        phone: "9876543210",
        role: Role.salesAgent,
      },
      {
        name: "Anjali Mehta",
        email: "anjali@avacasa.com",
        password: "Agent@123",
        phone: "9876543211",
        role: Role.salesAgent,
      },
      {
        name: "Developer One",
        email: "dev1@avacasa.com",
        password: "Dev@123",
        role: Role.Developer,
      },
      {
        name: "Developer Two",
        email: "dev2@avacasa.com",
        password: "Dev@123",
        role: Role.Developer,
      },
    ]);

    const agent1 = users[1]._id;
    const agent2 = users[2]._id;

    console.log("📋 Creating leads...");
    await Lead.create([
      {
        name: "Amit Verma",
        phone: "9000000001",
        email: "amit@gmail.com",
        source: LeadSource.Website,
        budgetRange: BudgetRange.Range50to75L,
        classification: LeadClassification.Warm,
        assignedAgent: agent1,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Priya Singh",
        phone: "9000000002",
        source: LeadSource.Portal,
        budgetRange: BudgetRange.Above1Cr,
        classification: LeadClassification.Hot,
        assignedAgent: agent2,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Rahul Khanna",
        phone: "9000000003",
        email: "rahul@gmail.com",
        source: LeadSource.Referral,
        budgetRange: BudgetRange.Below50L,
        classification: LeadClassification.Cold,
        assignedAgent: agent1,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Neha Joshi",
        phone: "9000000004",
        source: LeadSource.Social,
        classification: LeadClassification.Void,
        voidReason: VoidReason.NotInterested,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Suresh Rao",
        phone: "9000000005",
        email: "suresh@gmail.com",
        source: LeadSource.WalkIn,
        budgetRange: BudgetRange.Range75LtoCr,
        classification: LeadClassification.Warm,
        assignedAgent: agent2,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Karan Malhotra",
        phone: "9000000006",
        source: LeadSource.Website,
        budgetRange: BudgetRange.Above1Cr,
        classification: LeadClassification.Hot,
        assignedAgent: agent1,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Ritu Arora",
        phone: "9000000007",
        source: LeadSource.Referral,
        budgetRange: BudgetRange.Range50to75L,
        classification: LeadClassification.Warm,
        assignedAgent: agent2,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Vikas Jain",
        phone: "9000000008",
        source: LeadSource.Portal,
        classification: LeadClassification.Void,
        voidReason: VoidReason.BudgetMismatch,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Sneha Kapoor",
        phone: "9000000009",
        source: LeadSource.Website,
        budgetRange: BudgetRange.Range75LtoCr,
        classification: LeadClassification.Hot,
        assignedAgent: agent1,
        isDuplicate: false,
        isConverted: false,
      },
      {
        name: "Arjun Patel",
        phone: "9000000010",
        source: LeadSource.Social,
        budgetRange: BudgetRange.Below50L,
        classification: LeadClassification.Cold,
        assignedAgent: agent2,
        isDuplicate: false,
        isConverted: false,
      },

      // duplicates
      {
        name: "Duplicate Lead A",
        phone: "9000000011",
        source: LeadSource.Website,
        isDuplicate: true,
        duplicateTag: "PHONE_DUPLICATE",
        isConverted: false,
      },
      {
        name: "Duplicate Lead B",
        phone: "9000000012",
        source: LeadSource.Website,
        isDuplicate: true,
        duplicateTag: "PHONE_DUPLICATE",
        isConverted: false,
      },

      // converted leads
      {
        name: "Manish Gupta",
        phone: "9000000013",
        source: LeadSource.Portal,
        classification: LeadClassification.Warm,
        assignedAgent: agent1,
        isConverted: true,
      },
      {
        name: "Pooja Nair",
        phone: "9000000014",
        source: LeadSource.Referral,
        classification: LeadClassification.Hot,
        assignedAgent: agent2,
        isConverted: true,
      },

      // remaining
      ...Array.from({ length: 6 }).map((_, i) => ({
        name: `Lead ${i + 15}`,
        phone: `90000000${15 + i}`,
        source: LeadSource.Website,
        classification: LeadClassification.Cold,
        isDuplicate: false,
        isConverted: false,
      })),
    ]);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
