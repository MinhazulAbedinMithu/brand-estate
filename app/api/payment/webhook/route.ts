import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { Notification } from "@/lib/db/models/notification.model";
import { getStripeClient, getSystemSetting } from "@/lib/db/settings";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripeClient();
    const webhookSecret = await getSystemSetting("stripeWebhookSecret", "STRIPE_WEBHOOK_SECRET");
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { status: "error", message: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { type, userId, amount, propertyId, feePaid } = session.metadata || {};

      if (type === "deposit" && userId && amount) {
        // Process deposit checkout session
        const depositAmount = parseFloat(amount);
        const user = await User.findById(userId);
        let transaction = await WalletTransaction.findOne({ stripeSessionId: session.id });

        if (user) {
          if (!transaction) {
            transaction = new WalletTransaction({
              userId: user._id,
              amount: depositAmount,
              fee: 0,
              type: "deposit",
              status: "completed",
              description: `Wallet Deposit via Stripe`,
              stripeSessionId: session.id,
            });
            user.walletBalance = (user.walletBalance ?? 0) + depositAmount;
            await user.save();
            await transaction.save();

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

            const notification = new Notification({
              userId: user._id,
              title: "Deposit Successful",
              message: `Your deposit of $${depositAmount.toFixed(2)} was credited successfully. New balance: $${(user.walletBalance ?? 0).toFixed(2)}.`,
              type: "wallet_deposit",
            });
            await notification.save();
          }
          console.log(`Processed wallet deposit of $${depositAmount} for ${user.name} via webhook.`);
        }
      } else if (propertyId && userId) {
        // Fallback/Legacy Direct Application payments (kept for backwards compatibility)
        let application = await PropertyApplication.findOne({ stripeSessionId: session.id });

        if (!application) {
          const property = await Property.findById(propertyId);
          const user = await User.findById(userId);

          if (property && user) {
            application = new PropertyApplication({
              propertyId: property._id,
              propertyTitle: property.title,
              propertyImage: property.images?.[0] || "",
              userId: user._id,
              userName: user.name,
              agentOwnerId: property.ownerId,
              applicationFeePaid: parseFloat(feePaid || "0"),
              status: "pending",
              paymentStatus: "paid",
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string || "",
              submittedAt: new Date(),
            });
            await application.save();
            console.log(`Created application for ${user.name} via Stripe webhook.`);
          }
        } else {
          application.paymentStatus = "paid";
          application.stripePaymentIntentId = session.payment_intent as string || "";
          await application.save();
          console.log(`Updated application payment status for session ${session.id} via webhook.`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "Webhook processing failed." },
      { status: 500 }
    );
  }
}
