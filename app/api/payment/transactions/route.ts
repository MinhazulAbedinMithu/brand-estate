import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
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

    await connectDB();

    const transactions = await WalletTransaction.find({ userId: sessionUser.id })
      .sort({ createdAt: -1 })
      .populate("relatedUserId", "name email role avatar")
      .lean();

    // Map _id to id
    const mapped = transactions.map((t: any) => ({
      ...t,
      id: t._id.toString(),
      userId: t.userId.toString(),
      relatedUserId: t.relatedUserId ? {
        ...t.relatedUserId,
        id: t.relatedUserId._id.toString(),
      } : undefined,
    }));

    return NextResponse.json(
      { status: "success", data: mapped },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch transactions error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to load transactions." },
      { status: 500 }
    );
  }
}
