import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { verifyJwt } from "@/lib/auth/tokens";
import {
  DEFAULT_BACKGROUND_CHECK_URL,
  DEFAULT_CREDIT_SCORE_CHECK_URL,
  DEFAULT_TERMS_OF_SERVICE,
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_COOKIE_POLICY,
  DEFAULT_DISCLAIMER,
} from "@/lib/db/legal-defaults";

const COOKIE_NAME = "be_auth_token";

const getFallbackSettings = () => ({
  backgroundCheckUrl: DEFAULT_BACKGROUND_CHECK_URL,
  creditScoreCheckUrl: DEFAULT_CREDIT_SCORE_CHECK_URL,
  termsOfService: DEFAULT_TERMS_OF_SERVICE,
  privacyPolicy: DEFAULT_PRIVACY_POLICY,
  cookiePolicy: DEFAULT_COOKIE_POLICY,
  disclaimer: DEFAULT_DISCLAIMER,
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: "RealHoms <onboarding@resend.dev>",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBPb7s5e6FqId6Chu1D8P12PNGGQhV6VK0",
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "realestate-8727b.firebaseapp.com",
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "realestate-8727b",
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "realestate-8727b.firebasestorage.app",
  firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "685467231674",
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:685467231674:web:1e8d741a4ebe57aa2ce983",
  firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F4NWBS2CC2",
});

export async function GET() {
  try {
    await connectDB();
    const settings = await SystemSetting.find({});
    const mapped = getFallbackSettings();
    for (const item of settings) {
      if (item.key in mapped) {
        mapped[item.key as keyof typeof mapped] = item.value;
      }
    }
    return NextResponse.json({ status: "success", data: mapped });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ status: "success", data: getFallbackSettings() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }
    const payload = verifyJwt(token);
    if (!payload || !["admin", "super_admin"].includes(payload.role)) {
      return NextResponse.json(
        { status: "error", error: "Forbidden", message: "Admin privileges required." },
        { status: 403 }
      );
    }

    const {
      backgroundCheckUrl,
      creditScoreCheckUrl,
      termsOfService,
      privacyPolicy,
      cookiePolicy,
      disclaimer,
      resendApiKey,
      resendFromEmail,
      stripePublishableKey,
      stripeSecretKey,
      stripeWebhookSecret,

      firebaseApiKey,
      firebaseAuthDomain,
      firebaseProjectId,
      firebaseStorageBucket,
      firebaseMessagingSenderId,
      firebaseAppId,
      firebaseMeasurementId,
    } = await request.json();

    await connectDB();

    const updates = [
      { key: "backgroundCheckUrl", value: backgroundCheckUrl },
      { key: "creditScoreCheckUrl", value: creditScoreCheckUrl },
      { key: "termsOfService", value: termsOfService },
      { key: "privacyPolicy", value: privacyPolicy },
      { key: "cookiePolicy", value: cookiePolicy },
      { key: "disclaimer", value: disclaimer },
      { key: "resendApiKey", value: resendApiKey },
      { key: "resendFromEmail", value: resendFromEmail },
      { key: "stripePublishableKey", value: stripePublishableKey },
      { key: "stripeSecretKey", value: stripeSecretKey },
      { key: "stripeWebhookSecret", value: stripeWebhookSecret },

      { key: "firebaseApiKey", value: firebaseApiKey },
      { key: "firebaseAuthDomain", value: firebaseAuthDomain },
      { key: "firebaseProjectId", value: firebaseProjectId },
      { key: "firebaseStorageBucket", value: firebaseStorageBucket },
      { key: "firebaseMessagingSenderId", value: firebaseMessagingSenderId },
      { key: "firebaseAppId", value: firebaseAppId },
      { key: "firebaseMeasurementId", value: firebaseMeasurementId },
    ];

    for (const update of updates) {
      if (update.value !== undefined) {
        await SystemSetting.findOneAndUpdate(
          { key: update.key },
          { value: update.value },
          { upsert: true, returnDocument: 'after' }
        );
      }
    }

    return NextResponse.json({ status: "success", message: "Settings saved successfully." });
  } catch (err: any) {
    console.error("POST /api/settings error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}


