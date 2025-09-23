import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: Date;
  by: string; // userId, adminId, resellerId
}

export interface IWallet extends Document {
  ownerId: mongoose.Types.ObjectId;
  ownerModel: "User" | "Admin" | "Reseller";
  balance: number;
  currency: "USD" | "INR";
  transactions: ITransaction[];

  // methods
  credit(amount: number, by: string, description: string): Promise<void>;
  debit(amount: number, description: string, by: string): Promise<void>;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  by: { type: String, required: true },
});

const WalletSchema: Schema<IWallet> = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ownerModel: {
      type: String,
      enum: ["User", "Admin", "Reseller"],
      required: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, enum: ["USD", "INR"], default: "USD" },
    transactions: [TransactionSchema],
  },
  { timestamps: true }
);

// Methods
WalletSchema.methods.credit = async function (
  amount: number,
  by: string,
  description: string
) {
  this.balance += amount;
  this.transactions.push({ amount, type: "credit", description, by });
  await this.save();
};

WalletSchema.methods.debit = async function (
  amount: number,
  description: string,
  by: string
) {
  if (this.balance < amount) throw new Error("Insufficient balance");
  this.balance -= amount;
  this.transactions.push({
    amount,
    type: "debit",
    description,
    by,
  });
  await this.save();
};

export const Wallet: Model<IWallet> =
  mongoose.models?.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);
