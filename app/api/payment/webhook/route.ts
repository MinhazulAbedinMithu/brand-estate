import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
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
      
      const { propertyId, userId, feePaid } = session.metadata || {};
      if (propertyId && userId) {
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
