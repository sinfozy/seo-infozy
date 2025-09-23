import mongoose, { Document, Model, Schema } from "mongoose";

import { Currency } from "@/types/enums";
import bcrypt from "bcryptjs";

export interface IReseller extends Document {
  fullname: string;
  companyName: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  notes?: string;

  isActive?: boolean;

  currency: Currency;

  createdAt?: Date;
  updatedAt?: Date;

  // methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateOtp(): { code: string; expiresAt: Date };
}

const ResellerSchema: Schema<IReseller> = new Schema(
  {
    fullname: { type: String, required: true },
    companyName: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },

    notes: { type: String, default: "" },

    isActive: { type: Boolean, default: true },

    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.INR,
    },
  },
  { timestamps: true }
);

// Hash password before saving
ResellerSchema.pre("save", async function (next) {
  const reseller = this as IReseller;
  if (!reseller.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  reseller.password = await bcrypt.hash(reseller.password!, salt);

  next();
});

// Compare password
ResellerSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Reseller: Model<IReseller> =
  mongoose.models?.Reseller ||
  mongoose.model<IReseller>("Reseller", ResellerSchema);
