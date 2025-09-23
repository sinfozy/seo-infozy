import mongoose, { Document, Model, Schema } from "mongoose";

import { Plan as PlanEnum } from "@/types/enums";

export interface IPlan extends Document {
  name: PlanEnum;
  price: number;
  durationDays: number;
  searchesLimit: number;
  aiLimit: number | null;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, enum: Object.values(PlanEnum), required: true },
  price: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  searchesLimit: { type: Number, required: true },
  aiLimit: { type: Number, default: null },
});

PlanSchema.index({ name: 1 }, { unique: true });

export const PlanModel: Model<IPlan> =
  mongoose.models?.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
