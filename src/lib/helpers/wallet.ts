import { Wallet } from "@/models/wallet";

export async function rechargeWallet(
  ownerId: string,
  ownerModel: "User" | "Admin" | "Reseller",
  amount: number,
  by: string
) {
  const wallet = await Wallet.findOne({ ownerId, ownerModel });
  if (!wallet) throw new Error("Wallet not found");

  await wallet.credit(amount, by, "Self recharge via payment gateway");
  return wallet;
}

export async function transferWalletBalance(
  fromId: string,
  fromModel: "Admin" | "Reseller",
  toId: string,
  toModel: "Reseller" | "User",
  amount: number,
  by: string
) {
  const fromWallet = await Wallet.findOne({
    ownerId: fromId,
    ownerModel: fromModel,
  });
  const toWallet = await Wallet.findOne({ ownerId: toId, ownerModel: toModel });

  if (!fromWallet || !toWallet) throw new Error("Wallet not found");
  if (fromWallet.balance < amount) throw new Error("Insufficient balance");

  // Debit sender
  await fromWallet.debit(amount, `Transferred to ${toModel} ${toId}`, by);

  // Credit receiver
  await toWallet.credit(amount, by, `Received from ${fromModel} ${fromId}`);

  return { fromWallet, toWallet };
}
