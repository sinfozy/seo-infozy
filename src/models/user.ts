import mongoose, { Document, Model, Schema } from "mongoose";

import { Currency } from "@/types/enums";
import { PlanModel } from "./plan";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullname: string;
  username?: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  isVerified: boolean;
  notes?: string;

  location?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
  };

  otp: { code?: string; expiresAt?: Date };
  resetPassword: { token?: string; expiresAt?: Date };

  isActive?: boolean;

  plan: mongoose.Types.ObjectId | null;
  planActivatedAt?: Date | null;
  planEndsAt?: Date | null;
  currency: Currency;

  resellerId?: mongoose.Types.ObjectId | null;
  walletId?: mongoose.Types.ObjectId | null;

  // Track usage
  usedSearches: number;
  websiteSearchHistory: {
    url: string;
    searchedAt: Date;
  }[];
  aiConversationHistory: {
    input: string;
    output: string;
    createdAt: Date;
  }[];

  createdAt?: Date;
  updatedAt?: Date;

  // methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateOtp(): { code: string; expiresAt: Date };
  validateOtp(code: string): boolean;

  canUseWebsiteSearch(): Promise<boolean>;
  incrementWebsiteSearch(url: string): void;
  addAIConversation(input: string, output: string): void;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, minlength: 6 },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    location: {
      ip: { type: String },
      city: { type: String },
      region: { type: String },
      country: { type: String },
      loc: { type: String },
      org: { type: String },
    },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    resetPassword: {
      token: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    isActive: { type: Boolean, default: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
    planActivatedAt: { type: Date, default: null },
    planEndsAt: { type: Date, default: null },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.INR,
    },

    resellerId: { type: Schema.Types.ObjectId, ref: "Reseller", default: null },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", default: null },

    // Usage tracking
    usedSearches: { type: Number, default: 0 },
    websiteSearchHistory: [
      {
        url: { type: String, required: true },
        searchedAt: { type: Date, default: Date.now },
      },
    ],
    aiConversationHistory: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
UserSchema.methods.generateOtp = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  this.otp = { code, expiresAt };
  return { code, expiresAt };
};

// Validate OTP
UserSchema.methods.validateOtp = function (code: string) {
  if (!this.otp?.code || !this.otp?.expiresAt) return false;
  return this.otp.code === code && new Date(this.otp.expiresAt) > new Date();
};

// Check if user can search a website
UserSchema.methods.canUseWebsiteSearch = async function () {
  if (!this.plan) return false;

  // Populate plan if not populated
  let planData;
  if (typeof this.plan === "object" && this.plan.searchesLimit !== undefined) {
    planData = this.plan; // already populated
  } else {
    planData = await PlanModel.findById(this.plan);
  }

  if (!planData) return false;

  const limit = planData.searchesLimit ?? 0;

  return this.usedSearches < limit;
};

// Increment website search usage
UserSchema.methods.incrementWebsiteSearch = function (url: string) {
  if (!this.canUseWebsiteSearch()) throw new Error("Search limit reached.");
  this.usedSearches += 1;
  this.websiteSearchHistory.push({ url, searchedAt: new Date() });
};

// Add AI conversation
UserSchema.methods.addAIConversation = function (
  input: string,
  output: string
) {
  this.usedSearches += 1;
  this.aiConversationHistory.push({ input, output, createdAt: new Date() });
};

export const User: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
