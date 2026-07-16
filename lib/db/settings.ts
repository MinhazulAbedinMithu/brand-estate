import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { connectDB } from "@/lib/db/mongoose";
import Stripe from "stripe";

/**
 * Resolves a system configuration parameter from the database settings collection.
 * Falls back to process.env if not found or if the DB query fails.
 */
export async function getSystemSetting(key: string, envFallbackKey?: string): Promise<string> {
  try {
    await connectDB();
    const setting = await SystemSetting.findOne({ key }).lean();
    if (setting && typeof setting.value === "string" && setting.value.trim() !== "") {
      return setting.value.trim();
    }
  } catch (err) {
    console.error(`Failed to load system setting ${key} from DB:`, err);
  }
  return envFallbackKey ? (process.env[envFallbackKey] || "") : "";
}

/**
 * Instantiates a Stripe client dynamically using keys loaded from the settings database.
 * Falls back to standard process.env.STRIPE_SECRET_KEY.
 */
export async function getStripeClient(): Promise<Stripe> {
  const secretKey = await getSystemSetting("stripeSecretKey", "STRIPE_SECRET_KEY");
  return new Stripe(secretKey);
}
