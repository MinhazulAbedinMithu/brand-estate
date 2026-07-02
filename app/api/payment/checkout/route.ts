import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
import { getSessionUser } from "@/lib/auth/get-user";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    let body: { propertyId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", error: "InvalidBody", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { propertyId } = body;
    if (!propertyId) {
      return NextResponse.json(
        { status: "error", error: "ValidationError", message: "Property ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch user & check KYC + Phone status
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "User account not found." },
        { status: 404 }
      );
    }

    const isKycVerified = user.kycStatus === "verified" || user.nidStatus === "verified";
    if (!isKycVerified) {
      return NextResponse.json(
        { status: "error", error: "VerificationRequired", message: "Your identity KYC verification is required to apply." },
        { status: 400 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { status: "error", error: "VerificationRequired", message: "Your phone number verification is required to apply." },
        { status: 400 }
      );
    }

    // 2. Fetch property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "Property listing not found." },
        { status: 404 }
      );
    }

    // Check if already applied
    const existing = await PropertyApplication.findOne({ propertyId: property._id, userId: user._id });
    if (existing) {
      return NextResponse.json(
        { status: "error", error: "AlreadyApplied", message: "You have already applied for this property." },
        { status: 400 }
      );
    }

    const fee = property.applicationFeeRequired && property.applicationFee ? property.applicationFee : 0;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 3. Direct Application if fee is 0
    if (fee <= 0) {
      const application = new PropertyApplication({
        propertyId: property._id,
        propertyTitle: property.title,
        propertyImage: property.images?.[0] || "",
        userId: user._id,
        userName: user.name,
        agentOwnerId: property.ownerId,
        applicationFeePaid: 0,
        status: "pending",
        paymentStatus: "paid",
        submittedAt: new Date(),
      });
      await application.save();

      return NextResponse.json(
        { status: "success", direct: true, data: application },
        { status: 200 }
      );
    }

    // 4. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Application Fee: ${property.title}`,
              description: `Tenancy application fee for ${property.title}`,
              images: property.images?.[0] ? [property.images[0]] : [],
            },
            unit_amount: Math.round(fee * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        propertyId: property._id.toString(),
        userId: user._id.toString(),
        feePaid: fee.toString(),
      },
      success_url: `${appUrl}/property/${property.slug}/apply/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/property/${property.slug}/apply/cancel`,
    });

    return NextResponse.json(
      { status: "success", direct: false, url: checkoutSession.url },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Checkout creation failed." },
      { status: 500 }
    );
  }
}
