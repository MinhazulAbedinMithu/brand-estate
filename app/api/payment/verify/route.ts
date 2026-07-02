import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
import { getStripeClient } from "@/lib/db/settings";

export async function GET(request: NextRequest) {
  try {
    const stripe = await getStripeClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Session ID parameter is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Retrieve the session from Stripe
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

    const { propertyId, userId, feePaid } = checkoutSession.metadata || {};
    if (!propertyId || !userId) {
      return NextResponse.json(
        { status: "error", error: "InvalidMetadata", message: "Checkout session metadata is incomplete." },
        { status: 400 }
      );
    }

    // 2. Check if the application record already exists
    let application = await PropertyApplication.findOne({ stripeSessionId: sessionId });

    if (!application) {
      // Find property and user
      const property = await Property.findById(propertyId);
      const user = await User.findById(userId);

      if (!property || !user) {
        return NextResponse.json(
          { status: "error", error: "NotFound", message: "User or Property record not found." },
          { status: 404 }
        );
      }

      // Create property application record
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
        stripeSessionId: sessionId,
        stripePaymentIntentId: checkoutSession.payment_intent as string || "",
        submittedAt: new Date(),
      });
      await application.save();
    } else if (application.paymentStatus !== "paid") {
      application.paymentStatus = "paid";
      application.stripePaymentIntentId = checkoutSession.payment_intent as string || "";
      await application.save();
    }

    return NextResponse.json(
      { status: "success", data: application },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Verification Error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Verification failed." },
      { status: 500 }
    );
  }
}
