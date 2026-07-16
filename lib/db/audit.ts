import { type NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getSessionUser } from "@/lib/auth/get-user";
import { AuditLog } from "@/lib/db/models/audit-log.model";
import mongoose from "mongoose";

export async function recordAuditLog(
  request: NextRequest,
  action: string,
  details: string
): Promise<boolean> {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      console.warn(`[recordAuditLog] Attempted to log action "${action}" but no session user found.`);
      return false;
    }

    await connectDB();

    const ipAddress =
      (request as any).ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const userAgent = request.headers.get("user-agent") || "unknown";

    const auditEntry = new AuditLog({
      userId: new mongoose.Types.ObjectId(sessionUser.id),
      email: sessionUser.email,
      action,
      ipAddress,
      userAgent,
      details,
    });

    await auditEntry.save();
    return true;
  } catch (err) {
    console.error("[recordAuditLog] Error saving audit log to DB:", err);
    return false;
  }
}
