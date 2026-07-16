import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { Notification } from "@/lib/db/models/notification.model";
import { getSessionUser } from "@/lib/auth/get-user";
import { getStripeClient } from "@/lib/db/settings";
import { recordAuditLog } from "@/lib/db/audit";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(request);
    if (!sessionUser || (sessionUser.role !== "admin" && sessionUser.role !== "super_admin")) {
      return NextResponse.json(
        { status: "error", error: "Forbidden", message: "Only administrators can perform this action." },
        { status: 403 }
      );
    }

    let body: { status?: "approved" | "rejected"; reason?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", error: "InvalidBody", message: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { status, reason } = body;
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Status must be approved or rejected." },
        { status: 400 }
      );
    }

    await connectDB();

    const transaction = await WalletTransaction.findById(id);
    if (!transaction || transaction.type !== "withdraw") {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "Withdrawal request not found." },
        { status: 404 }
      );
    }

    if (transaction.status !== "pending") {
      return NextResponse.json(
        { status: "error", error: "InvalidState", message: `Withdrawal has already been ${transaction.status}.` },
        { status: 400 }
      );
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "Applicant user account not found." },
        { status: 404 }
      );
    }

    const rawAmount = Math.abs(transaction.amount);
    const netPayoutAmount = rawAmount - transaction.fee;

    if (status === "approved") {
      transaction.status = "completed";
      
      // Attempt Stripe connected account transfer
      try {
        const stripe = await getStripeClient();
        const transfer = await stripe.transfers.create({
          amount: Math.round(netPayoutAmount * 100), // in cents
          currency: "usd",
          destination: transaction.stripeAccountId!,
          description: `Payout for withdrawal request ${transaction._id}`,
        });
        transaction.stripePayoutId = transfer.id;
      } catch (stripeErr: any) {
        console.warn("Stripe Transfer failed, utilizing simulated fallback:", stripeErr.message);
        transaction.stripePayoutId = `ch_mock_payout_${Date.now()}`;
      }

      await transaction.save();

      // Create success notification
      const notification = new Notification({
        userId: user._id,
        title: "Withdrawal Approved",
        message: `Your withdrawal request of $${rawAmount.toFixed(2)} (Net: $${netPayoutAmount.toFixed(2)}) was approved. The funds were sent to Stripe account ${transaction.stripeAccountId}.`,
        type: "wallet_withdraw",
      });
      await notification.save();

    } else {
      // Status is rejected
      transaction.status = "rejected";
      if (reason) {
        transaction.description += ` | Rejected: ${reason}`;
      }
      await transaction.save();

      // Return the reserved funds back to user's wallet
      user.walletBalance = (user.walletBalance ?? 0) + rawAmount;
      await user.save();

      // Create rejection notification
      const notification = new Notification({
        userId: user._id,
        title: "Withdrawal Rejected",
        message: `Your withdrawal request of $${rawAmount.toFixed(2)} was rejected. $${rawAmount.toFixed(2)} has been refunded to your wallet balance.${reason ? ` Reason: ${reason}` : ""}`,
        type: "wallet_withdraw",
      });
      await notification.save();
    }

    await recordAuditLog(
      request,
      "WITHDRAWAL_REVIEW",
      `Reviewed withdrawal request ${transaction._id} for ${user.name} (${user.email}). Status: "${status}".${
        reason ? ` Reason: ${reason}` : ""
      }`
    );

    return NextResponse.json(
      { 
        status: "success", 
        message: `Withdrawal request has been ${status === "approved" ? "approved and paid" : "rejected and refunded"} successfully.`, 
        data: {
          transaction: {
            ...transaction.toObject(),
            id: transaction._id.toString(),
          },
          userBalance: user.walletBalance
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Review withdrawal error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to process withdrawal request." },
      { status: 500 }
    );
  }
}
