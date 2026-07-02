import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user.model";
import { Property } from "@/lib/db/models/property.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
import { getSessionUser } from "@/lib/auth/get-user";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ idOrSlug: string }>;
}

function isObjectId(val: string): boolean {
  return mongoose.Types.ObjectId.isValid(val);
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { idOrSlug } = await context.params;
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Fetch user & check KYC + Phone verification status
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "User not found." },
        { status: 404 }
      );
    }

    // Require KYC verified and Phone verified to apply
    const isKycVerified = user.kycStatus === "verified" || user.nidStatus === "verified";
    if (!isKycVerified) {
      return NextResponse.json(
        { 
          status: "error", 
          error: "VerificationRequired", 
          message: "Your profile KYC (identity document verification) must be verified before you can apply for properties." 
        },
        { status: 400 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { 
          status: "error", 
          error: "VerificationRequired", 
          message: "Your phone number must be verified before you can apply for properties." 
        },
        { status: 400 }
      );
    }

    // 2. Fetch property details by ID or Slug
    let query = {};
    if (isObjectId(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug.toLowerCase() };
    }

    const property = await Property.findOne(query);
    if (!property) {
      return NextResponse.json(
        { status: "error", error: "NotFound", message: "Property not found." },
        { status: 404 }
      );
    }

    // Check if already applied
    const existing = await PropertyApplication.findOne({ propertyId: property._id, userId: user._id });
    if (existing) {
      return NextResponse.json(
        { status: "error", error: "AlreadyApplied", message: "You have already submitted an application for this property." },
        { status: 400 }
      );
    }

    // 3. Handle Application Fee payment (Direct route only supports free properties)
    const fee = property.applicationFeeRequired && property.applicationFee ? property.applicationFee : 0;
    if (fee > 0) {
      return NextResponse.json(
        { 
          status: "error", 
          error: "PaymentRequired", 
          message: `This application requires a fee of $${fee}. Please apply via the Stripe checkout portal.` 
        },
        { status: 402 }
      );
    }

    // 4. Create property application record
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
      { 
        status: "success", 
        message: "Application submitted successfully! 🚀",
        data: application 
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Property apply error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
