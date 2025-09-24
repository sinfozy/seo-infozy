import { NextResponse } from "next/server";
import { Reseller } from "@/models/reseller";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

// Admin Dashboard Stats API
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // --- USERS ---
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: last30Days },
    });

    // --- RESELLERS ---
    const totalResellers = await Reseller.countDocuments();
    const newResellers = await Reseller.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // --- PLAN DISTRIBUTION ---
    // join User.plan (ObjectId) -> Plan._id
    const planDistribution = await User.aggregate([
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

    // --- SALES ANALYTICS (Users vs Resellers) ---
    const sales = await Wallet.aggregate([
      { $unwind: "$transactions" },
      {
        $match: {
          "transactions.type": "credit",
          "transactions.createdAt": { $gte: new Date(now.getFullYear(), 0, 1) },
        },
      },
      {
        $project: {
          ownerModel: 1,
          amount: "$transactions.amount",
          createdAt: "$transactions.createdAt",
          month: { $month: "$transactions.createdAt" },
        },
      },
      {
        $group: {
          _id: { month: "$month", ownerModel: "$ownerModel" },
          totalSales: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          sales: { $push: { k: "$_id.ownerModel", v: "$totalSales" } },
        },
      },
      {
        $project: {
          month: "$_id",
          sales: { $arrayToObject: "$sales" },
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // --- GROWTH TREND ---
    const userGrowth = await User.aggregate([
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

    const resellerGrowth = await Reseller.aggregate([
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
          totalResellers,
          newResellers,
        },
        planDistribution,
        salesAnalytics: sales,
        growthTrend: {
          users: userGrowth,
          resellers: resellerGrowth,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
