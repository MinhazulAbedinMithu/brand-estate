import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { Inquiry } from "@/lib/db/models/inquiry.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { AuditLog } from "@/lib/db/models/audit-log.model";
import { getSessionUser } from "@/lib/auth/get-user";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    if (sessionUser.role !== "super_admin") {
      return NextResponse.json(
        { status: "error", error: "Forbidden", message: "Super admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    // 1. Basic counters
    const [
      totalUsers,
      totalProperties,
      activeProperties,
      pendingProperties,
      totalInquiries,
      recentUsersList,
      recentPropertiesList,
      recentAuditLogsList,
      allCompletedTransactions,
      recentTransactionsList,
    ] = await Promise.all([
      User.countDocuments({}),
      Property.countDocuments({}),
      Property.countDocuments({ status: "active" }),
      Property.countDocuments({ status: "pending_approval" }),
      Inquiry.countDocuments({}),
      User.find({}).sort({ createdAt: -1 }).limit(30).lean(),
      Property.find({}).sort({ createdAt: -1 }).limit(30).populate("ownerId", "name email role").lean(),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(50).populate("userId", "name role email").lean(),
      WalletTransaction.find({ status: "completed" }).sort({ createdAt: 1 }).lean(),
      WalletTransaction.find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("userId", "name email role")
        .populate("relatedUserId", "name email role")
        .lean(),
    ]);

    // 2. Compute payment overview statistics
    let totalRevenue = 0;
    let totalDeposits = 0;
    let totalPayouts = 0;

    let dailyRevenue = 0;
    let dailyDeposits = 0;
    let dailyPayouts = 0;

    let weeklyRevenue = 0;
    let weeklyDeposits = 0;
    let weeklyPayouts = 0;

    let monthlyRevenue = 0;
    let monthlyDeposits = 0;
    let monthlyPayouts = 0;

    let yearlyRevenue = 0;
    let yearlyDeposits = 0;
    let yearlyPayouts = 0;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    for (const tx of allCompletedTransactions) {
      const createdDate = new Date(tx.createdAt);

      if (tx.type === "withdraw") {
        const rawAmount = Math.abs(tx.amount);
        const fee = tx.fee ?? 0;
        const netPayout = rawAmount - fee;

        totalRevenue += fee;
        totalPayouts += netPayout;

        if (createdDate >= oneDayAgo) {
          dailyRevenue += fee;
          dailyPayouts += netPayout;
        }
        if (createdDate >= oneWeekAgo) {
          weeklyRevenue += fee;
          weeklyPayouts += netPayout;
        }
        if (createdDate >= oneMonthAgo) {
          monthlyRevenue += fee;
          monthlyPayouts += netPayout;
        }
        if (createdDate >= oneYearAgo) {
          yearlyRevenue += fee;
          yearlyPayouts += netPayout;
        }
      } else if (tx.type === "deposit") {
        const depositAmt = Math.abs(tx.amount);
        totalDeposits += depositAmt;

        if (createdDate >= oneDayAgo) {
          dailyDeposits += depositAmt;
        }
        if (createdDate >= oneWeekAgo) {
          weeklyDeposits += depositAmt;
        }
        if (createdDate >= oneMonthAgo) {
          monthlyDeposits += depositAmt;
        }
        if (createdDate >= oneYearAgo) {
          yearlyDeposits += depositAmt;
        }
      }
    }

    // 3. Helper to aggregate Recharts timeline data in JS
    // A. Daily Chart Data (Past 30 days)
    const dailyDataMap = new Map<string, { name: string; revenue: number; deposits: number; payouts: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      dailyDataMap.set(dateStr, { name: dateStr, revenue: 0, deposits: 0, payouts: 0 });
    }

    // B. Weekly Chart Data (Past 8 weeks)
    const weeklyDataMap = new Map<string, { name: string; revenue: number; deposits: number; payouts: number }>();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStr = `Wk -${i}`;
      weeklyDataMap.set(weekStr, { name: weekStr, revenue: 0, deposits: 0, payouts: 0 });
    }

    // C. Monthly Chart Data (Past 12 months)
    const monthlyDataMap = new Map<string, { name: string; revenue: number; deposits: number; payouts: number }>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyDataMap.set(monthStr, { name: monthStr, revenue: 0, deposits: 0, payouts: 0 });
    }

    // D. Yearly Chart Data (Past 5 years)
    const yearlyDataMap = new Map<string, { name: string; revenue: number; deposits: number; payouts: number }>();
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearStr = year.toString();
      yearlyDataMap.set(yearStr, { name: yearStr, revenue: 0, deposits: 0, payouts: 0 });
    }

    // Populate timeline maps
    for (const tx of allCompletedTransactions) {
      const txDate = new Date(tx.createdAt);
      const dateStr = txDate.toISOString().split("T")[0];
      const yearStr = txDate.getFullYear().toString();
      
      const monthStr = txDate.toLocaleString("default", { month: "short", year: "2-digit" });

      // Determine values
      let revVal = 0;
      let depVal = 0;
      let payVal = 0;

      if (tx.type === "withdraw") {
        revVal = tx.fee ?? 0;
        payVal = Math.abs(tx.amount) - revVal;
      } else if (tx.type === "deposit") {
        depVal = Math.abs(tx.amount);
      }

      // Add to Daily
      if (dailyDataMap.has(dateStr)) {
        const dayObj = dailyDataMap.get(dateStr)!;
        dayObj.revenue += revVal;
        dayObj.deposits += depVal;
        dayObj.payouts += payVal;
      }

      // Add to Weekly (find closest week index)
      const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekIdx = Math.floor(diffDays / 7);
      if (weekIdx >= 0 && weekIdx <= 7) {
        const weekStr = `Wk -${weekIdx}`;
        if (weeklyDataMap.has(weekStr)) {
          const wkObj = weeklyDataMap.get(weekStr)!;
          wkObj.revenue += revVal;
          wkObj.deposits += depVal;
          wkObj.payouts += payVal;
        }
      }

      // Add to Monthly
      if (monthlyDataMap.has(monthStr)) {
        const mnObj = monthlyDataMap.get(monthStr)!;
        mnObj.revenue += revVal;
        mnObj.deposits += depVal;
        mnObj.payouts += payVal;
      }

      // Add to Yearly
      if (yearlyDataMap.has(yearStr)) {
        const yrObj = yearlyDataMap.get(yearStr)!;
        yrObj.revenue += revVal;
        yrObj.deposits += depVal;
        yrObj.payouts += payVal;
      }
    }

    // Convert Map values to arrays
    const dailyChart = Array.from(dailyDataMap.values());
    const weeklyChart = Array.from(weeklyDataMap.values()).reverse();
    const monthlyChart = Array.from(monthlyDataMap.values());
    const yearlyChart = Array.from(yearlyDataMap.values());

    return NextResponse.json({
      status: "success",
      data: {
        counters: {
          totalUsers,
          totalProperties,
          activeProperties,
          pendingProperties,
          totalInquiries,
          totalRevenue,
          totalDeposits,
          totalPayouts,
        },
        revenueSummary: {
          daily: { revenue: dailyRevenue, deposits: dailyDeposits, payouts: dailyPayouts },
          weekly: { revenue: weeklyRevenue, deposits: weeklyDeposits, payouts: weeklyPayouts },
          monthly: { revenue: monthlyRevenue, deposits: monthlyDeposits, payouts: monthlyPayouts },
          yearly: { revenue: yearlyRevenue, deposits: yearlyDeposits, payouts: yearlyPayouts },
          allTime: { revenue: totalRevenue, deposits: totalDeposits, payouts: totalPayouts },
        },
        timelines: {
          daily: dailyChart,
          weekly: weeklyChart,
          monthly: monthlyChart,
          yearly: yearlyChart,
        },
        paymentLogs: recentTransactionsList.map((t: any) => ({
          id: t._id.toString(),
          userId: t.userId?._id?.toString() || "",
          userName: t.userId?.name || "Deleted User",
          userEmail: t.userId?.email || "",
          userRole: t.userId?.role || "auth_user",
          relatedUserName: t.relatedUserId?.name || "",
          amount: t.amount,
          fee: t.fee,
          type: t.type,
          status: t.status,
          description: t.description,
          createdAt: t.createdAt,
        })),
        propertyLogs: recentPropertiesList.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          category: p.propertyCategory,
          type: p.transactionType,
          price: p.price,
          status: p.status,
          views: p.views ?? 0,
          ownerName: p.ownerId?.name || p.listerProfile?.name || "System Seed",
          ownerEmail: p.ownerId?.email || p.listerProfile?.email || "",
          createdAt: p.createdAt,
        })),
        userLogs: recentUsersList.map((u: any) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
        })),
        auditLogs: recentAuditLogsList.map((log: any) => ({
          id: log._id.toString(),
          actorName: log.userId ? log.userId.name : "System / External",
          actorRole: log.userId ? log.userId.role : "admin",
          email: log.email,
          action: log.action,
          target: log.details,
          timestamp: log.createdAt,
          ipAddress: log.ipAddress || "127.0.0.1",
        })),
      },
    });
  } catch (err: any) {
    console.error("GET /api/analytics/super-admin error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
