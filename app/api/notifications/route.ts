import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Notification } from "@/lib/db/models/notification.model";
import { getSessionUser } from "@/lib/auth/get-user";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    await connectDB();

    const notifications = await Notification.find({ userId: sessionUser.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const mapped = notifications.map((n: any) => ({
      ...n,
      id: n._id.toString(),
      userId: n.userId.toString(),
    }));

    return NextResponse.json(
      { status: "success", data: mapped },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to load notifications." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: "error", error: "Unauthorized", message: "Authentication required." },
        { status: 401 }
      );
    }

    await connectDB();

    // Mark all as read
    await Notification.updateMany(
      { userId: sessionUser.id, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json(
      { status: "success", message: "All notifications marked as read." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Mark notifications as read error:", err);
    return NextResponse.json(
      { status: "error", error: "InternalServerError", message: err.message || "Failed to update notifications." },
      { status: 500 }
    );
  }
}
