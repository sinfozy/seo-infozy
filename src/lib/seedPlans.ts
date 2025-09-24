import { Plan } from "../types/enums";
import { PlanModel } from "../models/plan";

export const defaultPlans = [
  {
    name: Plan.TRIAL,
    price: 0,
    durationDays: 7,
    searchesLimit: 10,
  },
  {
    name: Plan.MONTHLY,
    price: 799,
    durationDays: 30,
    searchesLimit: 50,
  },
  {
    name: Plan.THREE_MONTHS,
    price: 2499,
    durationDays: 90,
    searchesLimit: 180,
  },
  {
    name: Plan.SIX_MONTHS,
    price: 4699,
    durationDays: 180,
    searchesLimit: 360,
  },
  {
    name: Plan.YEARLY,
    price: 7999,
    durationDays: 365,
    searchesLimit: 950,
  },
];

export async function seedPlans() {
  for (const plan of defaultPlans) {
    await PlanModel.updateOne({ name: plan.name }, plan, { upsert: true });
  }
  console.log("✅ Plans seeded/updated successfully");
}
