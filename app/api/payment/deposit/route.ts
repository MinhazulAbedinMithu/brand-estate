import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { getSessionUser } from "@/lib/auth/get-user";
import { getStripeClient } from "@/lib/db/settings";

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    let body: { amount?: number };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", error: "InvalidBody", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { amount } = body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    await connectDB();
    const stripe = await getStripeClient();

    // Verify user exists
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "User account not found." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Wallet Deposit`,
              description: `Adding funds to your RealHoms Wallet balance`,
            },
            unit_amount: Math.round(amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        type: "deposit",
        userId: user._id.toString(),
        amount: amount.toString(),
      },
      success_url: `${appUrl}/dashboard/wallet?session_id={CHECKOUT_SESSION_ID}&deposit=success`,
      cancel_url: `${appUrl}/dashboard/wallet?deposit=cancelled`,
    });

    // Create pending WalletTransaction
    const transaction = new WalletTransaction({
      userId: user._id,
      amount: amount,
      fee: 0,
      type: "deposit",
      status: "pending",
      description: `Wallet Deposit via Stripe`,
      stripeSessionId: checkoutSession.id,
    });
    await transaction.save();

    return NextResponse.json(
      { status: "success", url: checkoutSession.url },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Deposit Session Error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to initialize deposit." },
      { status: 500 }
    );
  }
}
