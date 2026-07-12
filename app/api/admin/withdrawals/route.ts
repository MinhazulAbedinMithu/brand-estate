import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { getSessionUser } from "@/lib/auth/get-user";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser || (sessionUser.role !== "admin" && sessionUser.role !== "super_admin")) {
      return NextResponse.json(
        { status: "error", error: "Forbidden", message: "Only administrators can access this endpoint." },
        { status: 403 }
      );
    }

    await connectDB();

    const withdrawals = await WalletTransaction.find({ type: "withdraw" })
      .sort({ createdAt: -1 })
      .populate("userId", "name email role avatar")
      .lean();

    // Map _id to id
    const mapped = withdrawals.map((t: any) => ({
      ...t,
      id: t._id.toString(),
      userId: t.userId ? {
        ...t.userId,
        id: t.userId._id.toString(),
      } : null,
    }));

    return NextResponse.json(
      { status: "success", data: mapped },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch admin withdrawals error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to load withdrawal requests." },
      { status: 500 }
    );
  }
}
