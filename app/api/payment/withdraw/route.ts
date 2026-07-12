import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { Notification } from "@/lib/db/models/notification.model";
import { getSessionUser } from "@/lib/auth/get-user";

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    let body: { amount?: number; stripeAccountId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", error: "InvalidBody", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { amount, stripeAccountId } = body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Withdrawal amount must be a positive number." },
        { status: 400 }
      );
    }

    if (!stripeAccountId || typeof stripeAccountId !== "string" || stripeAccountId.trim() === "") {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Stripe withdraw account ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user exists and check balance
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "User account not found." },
        { status: 404 }
      );
    }

    const currentBalance = user.walletBalance ?? 0;
    if (currentBalance < amount) {
      return NextResponse.json(
        { 
          status: "error", 
          error: "InsufficientFunds", 
          message: `Insufficient wallet balance. You have $${currentBalance.toFixed(2)} but requested to withdraw $${amount.toFixed(2)}.` 
        },
        { status: 400 }
      );
    }

    // Deduct 10% fee from the payout amount
    const fee = amount * 0.10;
    const netAmount = amount - fee;

    // Reserve/deduct balance from user immediately to prevent double spending
    user.walletBalance = currentBalance - amount;
    await user.save();

    // Create a pending withdraw transaction
    // amount is stored as negative because it is deducted from the wallet balance
    const transaction = new WalletTransaction({
      userId: user._id,
      amount: -amount,
      fee: fee,
      type: "withdraw",
      status: "pending",
      stripeAccountId: stripeAccountId.trim(),
      description: `Withdraw request to Stripe account ${stripeAccountId.trim()} (Net: $${netAmount.toFixed(2)})`,
    });
    await transaction.save();

    // Create notification
    const notification = new Notification({
      userId: user._id,
      title: "Withdrawal Requested",
      message: `Your request to withdraw $${amount.toFixed(2)} (Net: $${netAmount.toFixed(2)}) has been submitted for review.`,
      type: "wallet_withdraw",
    });
    await notification.save();

    return NextResponse.json(
      { 
        status: "success", 
        message: "Withdrawal request submitted successfully.",
        data: {
          walletBalance: user.walletBalance,
          transaction: {
            ...transaction.toObject(),
            id: transaction._id.toString(),
          }
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Withdraw Session Error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Withdrawal request failed." },
      { status: 500 }
    );
  }
}
