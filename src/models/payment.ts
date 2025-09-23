import mongoose, { Document, Model, Schema } from "mongoose";

import { Currency } from "@/types/enums";

export interface IPayment extends Document {
  ownerId: mongoose.Types.ObjectId;
  ownerModel: "User" | "Reseller";
  amount: number;
  currency: Currency;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: "created" | "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true },
    ownerModel: { type: String, enum: ["User", "Reseller"], required: true },
    amount: { type: Number, required: true },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.INR,
    },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models?.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
