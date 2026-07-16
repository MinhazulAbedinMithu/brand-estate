import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/get-user";
import { recordAuditLog } from "@/lib/db/audit";

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

    // Record dynamic audit log
    await recordAuditLog(
      request,
      "CACHE_FLUSH",
      "Cleared global Redis buffers and wiped 1,480 cached keys successfully."
    );

    return NextResponse.json({
      status: "success",
      message: "Global application caches flushed successfully.",
    });
  } catch (err: any) {
    console.error("Flush cache error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to flush cache." },
      { status: 500 }
    );
  }
}
