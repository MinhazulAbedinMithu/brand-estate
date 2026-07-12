import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { Notification } from "@/lib/db/models/notification.model";
import { getStripeClient } from "@/lib/db/settings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Session ID parameter is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const stripe = await getStripeClient();

    // Retrieve the session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (!checkoutSession) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "Stripe checkout session not found." },
        { status: 404 }
      );
    }

    if (checkoutSession.status !== "complete" && checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { status: "error", error: "PaymentIncomplete", message: "Payment checkout has not been completed." },
        { status: 400 }
      );
    }

    const { type, userId, amount } = checkoutSession.metadata || {};
    if (type !== "deposit" || !userId || !amount) {
      return NextResponse.json(
        { status: "error", error: "InvalidMetadata", message: "Checkout session metadata is invalid." },
        { status: 400 }
      );
    }

    // Find transaction record
    let transaction = await WalletTransaction.findOne({ stripeSessionId: sessionId });
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "User record not found." },
        { status: 404 }
      );
    }

    const depositAmount = parseFloat(amount);

    if (!transaction) {
      // Create if it didn't exist for some reason
      transaction = new WalletTransaction({
        userId: user._id,
        amount: depositAmount,
        fee: 0,
        type: "deposit",
        status: "completed",
        description: `Wallet Deposit via Stripe`,
        stripeSessionId: sessionId,
      });
      user.walletBalance = (user.walletBalance ?? 0) + depositAmount;
      await user.save();
      await transaction.save();

      // Create notification
      const notification = new Notification({
        userId: user._id,
        title: "Deposit Successful",
        message: `Your deposit of $${depositAmount.toFixed(2)} was credited successfully. New balance: $${(user.walletBalance ?? 0).toFixed(2)}.`,
        type: "wallet_deposit",
      });
      await notification.save();
    } else if (transaction.status === "pending") {
      transaction.status = "completed";
      user.walletBalance = (user.walletBalance ?? 0) + depositAmount;
      await user.save();
      await transaction.save();

      // Create notification
      const notification = new Notification({
        userId: user._id,
        title: "Deposit Successful",
        message: `Your deposit of $${depositAmount.toFixed(2)} was credited successfully. New balance: $${(user.walletBalance ?? 0).toFixed(2)}.`,
        type: "wallet_deposit",
      });
      await notification.save();
    }

    return NextResponse.json(
      { 
        status: "success", 
        data: {
          walletBalance: user.walletBalance,
          transaction: transaction,
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Deposit Verification Error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Verification failed." },
      { status: 500 }
    );
  }
}
