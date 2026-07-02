import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { SystemSetting } from "@/lib/db/models/system-setting.model";
import { verifyJwt } from "@/lib/auth/tokens";

const COOKIE_NAME = "be_auth_token";

const DEFAULT_SETTINGS = {
  backgroundCheckUrl: "https://check.brandestate.com/test-bg-report",
  creditScoreCheckUrl: "https://check.brandestate.com/test-credit-score",
};

export async function GET() {
  try {
    await connectDB();
    const settings = await SystemSetting.find({});
    const mapped = { ...DEFAULT_SETTINGS };
    for (const item of settings) {
      if (item.key in mapped) {
        mapped[item.key as keyof typeof DEFAULT_SETTINGS] = item.value;
      }
    }
    return NextResponse.json({ status: "success", data: mapped });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ status: "success", data: DEFAULT_SETTINGS });
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

    const { backgroundCheckUrl, creditScoreCheckUrl } = await request.json();
    await connectDB();

    if (backgroundCheckUrl !== undefined) {
      await SystemSetting.findOneAndUpdate(
        { key: "backgroundCheckUrl" },
        { value: backgroundCheckUrl },
        { upsert: true, new: true }
      );
    }
    if (creditScoreCheckUrl !== undefined) {
      await SystemSetting.findOneAndUpdate(
        { key: "creditScoreCheckUrl" },
        { value: creditScoreCheckUrl },
        { upsert: true, new: true }
      );
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
