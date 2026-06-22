import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { Property } from '@/lib/db/models/property.model';
import { Inquiry } from '@/lib/db/models/inquiry.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

// ─────────────────────────────────────────────
// GET /api/analytics/admin
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    // Role check
    const isAllowed = ['admin', 'super_admin'].includes(payload.role);
    if (!isAllowed) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to view admin analytics.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Query counters
    const [totalUsers, activeListings, pendingApprovals, totalInquiries] = await Promise.all([
      User.countDocuments({}),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending_approval' }),
      Inquiry.countDocuments({}),
    ]);

    // Daily inquiries (created in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    // Monthly signup growth tracking (last 6 months)
    const last6Months = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date();
      d.setMonth(d.getMonth() - idx);
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
      };
    }).reverse();

    const signupsHistory = await Promise.all(
      last6Months.map(async (m) => {
        const start = new Date(m.year, m.monthNum, 1);
        const end = new Date(m.year, m.monthNum + 1, 0, 23, 59, 59, 999);

        const [usersCount, agentsCount] = await Promise.all([
          User.countDocuments({
            role: { $in: ['auth_user'] },
            createdAt: { $gte: start, $lte: end },
          }),
          User.countDocuments({
            role: 'agent',
            createdAt: { $gte: start, $lte: end },
          }),
        ]);

        return {
          month: m.month,
          Users: usersCount,
          Agents: agentsCount,
        };
      })
    );

    // If database counts are zero (due to clean DB), let's ensure we return valid stats structure
    return NextResponse.json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          activeListings,
          pendingApprovals,
          totalInquiries,
          dailyInquiries,
        },
        signupsHistory,
      },
    });
  } catch (err: unknown) {
    console.error('[GET /api/analytics/admin]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
