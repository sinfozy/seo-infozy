import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

// Reseller Dashboard Stats API
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "reseller") {
      return NextResponse.json(
        { message: "Unauthorized. Reseller access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const resellerId = session.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // --- USERS (under reseller) ---
    const totalUsers = await User.countDocuments({ resellerId });
    const newUsers = await User.countDocuments({
      resellerId,
      createdAt: { $gte: startOfMonth },
    });
    const activeUsers = await User.countDocuments({
      resellerId,
      updatedAt: { $gte: last30Days },
    });

    // --- PLAN DISTRIBUTION (reseller’s users) ---
    const planDistribution = await User.aggregate([
      { $match: { resellerId } },
      {
        $lookup: {
          from: "plans",
          localField: "plan",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$plan.name",
          count: { $sum: 1 },
        },
      },
      { $project: { plan: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    // --- SALES ANALYTICS (reseller’s users) ---
    const salesAnalytics = await Wallet.aggregate([
      { $match: { ownerModel: "User" } },
      { $unwind: "$transactions" },
      {
        $match: {
          "transactions.type": "credit",
          "transactions.createdAt": { $gte: new Date(now.getFullYear(), 0, 1) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.resellerId": resellerId } },
      {
        $project: {
          amount: "$transactions.amount",
          createdAt: "$transactions.createdAt",
          month: { $month: "$transactions.createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          totalSales: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { month: "$_id", totalSales: 1, _id: 0 } },
    ]);

    // --- RECENT SALES (last 5 transactions of reseller’s users) ---
    const recentSales = await Wallet.aggregate([
      { $match: { ownerModel: "User" } },
      { $unwind: "$transactions" },
      { $sort: { "transactions.createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.resellerId": resellerId } },
      {
        $project: {
          amount: "$transactions.amount",
          createdAt: "$transactions.createdAt",
          name: "$user.fullname",
          plan: "$user.planType",
        },
      },
      { $limit: 5 },
    ]);

    // --- USER GROWTH TREND ---
    const userGrowth = await User.aggregate([
      { $match: { resellerId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          newUsers,
          activeUsers,
        },
        planDistribution,
        salesAnalytics,
        recentSales,
        growthTrend: {
          users: userGrowth,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching reseller dashboard stats:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
