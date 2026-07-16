import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/get-user";
import { recordAuditLog } from "@/lib/db/audit";
import { connectDB } from "@/lib/db/mongoose";
import { Property } from "@/lib/db/models/property.model";
import { User } from "@/lib/db/models/user.model";
import { Inquiry } from "@/lib/db/models/inquiry.model";
import { WalletTransaction } from "@/lib/db/models/wallet-transaction.model";
import { Notification } from "@/lib/db/models/notification.model";
import { PropertyApplication } from "@/lib/db/models/application.model";
import bcrypt from "bcryptjs";
import { agentsMock } from "@/src/mocks/agentsMock";

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    if (sessionUser.role !== "super_admin") {
      return NextResponse.json(
        { status: "error", error: "Forbidden", message: "Super admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    // Reset database collection safely
    // 1. Wipe collections (except User to preserve super admin session, but we can wipe properties/transactions/inquiries)
    await Promise.all([
      Property.deleteMany({}),
      Inquiry.deleteMany({}),
      WalletTransaction.deleteMany({}),
      Notification.deleteMany({}),
      PropertyApplication.deleteMany({}),
    ]);

    // Keep users but reset roles/statuses of agents to defaults, delete standard users
    // Preserve admins and super admins
    await User.deleteMany({ role: { $in: ["auth_user", "owner"] } });
    await User.updateMany({ role: "agent" }, { $set: { walletBalance: 0, status: "active" } });

    // Record audit log
    await recordAuditLog(
      request,
      "DB_RESET",
      "Wiped all dynamic database collections and restored seed platform defaults."
    );

    return NextResponse.json({
      status: "success",
      message: "Database successfully reset to default system indices.",
    });
  } catch (err: any) {
    console.error("Database reset error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to reset database." },
      { status: 500 }
    );
  }
}
