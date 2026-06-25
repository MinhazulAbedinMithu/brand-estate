import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property, IProperty } from '@/lib/db/models/property.model';
import { User } from '@/lib/db/models/user.model';
import { Inquiry } from '@/lib/db/models/inquiry.model';
import { verifyJwt } from '@/lib/auth/tokens';

const COOKIE_NAME = 'be_auth_token';

// ─────────────────────────────────────────────
// GET /api/analytics/agent
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
    const isAllowed = ['agent', 'owner', 'admin', 'super_admin'].includes(payload.role);
    if (!isAllowed) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to view agent analytics.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Fetch properties of the agent
    const properties = await Property.find({ ownerId: payload.id }).lean();
    const propertyIds = properties.map((p) => p._id);

    // Sum views
    const totalViews = (properties as IProperty[]).reduce((acc, p) => acc + (p.views || 0), 0);

    // Calculate total saves (favorites by buyers)
    const totalSaves = await User.countDocuments({
      savedProperties: { $in: propertyIds },
    });

    // Inquiries totals
    const [totalInquiries, newInquiries] = await Promise.all([
      Inquiry.countDocuments({ agentId: payload.id }),
      Inquiry.countDocuments({ agentId: payload.id, status: 'new' }),
    ]);

    const activeListings = (properties as IProperty[]).filter((p) => p.status === 'active').length;
    const draftListings = (properties as IProperty[]).filter(
      (p) => p.status === 'draft' || p.status === 'pending_approval'
    ).length;
    const archivedListings = (properties as IProperty[]).filter(
      (p) => p.status === 'sold' || p.status === 'rented'
    ).length;

    // Simulated Recharts 5-day / 5-week history aligned with total counts
    const mockTimeline = [
      { name: 'Week 1', views: Math.floor(totalViews * 0.15), leads: Math.max(0, Math.floor(totalInquiries * 0.15)) },
      { name: 'Week 2', views: Math.floor(totalViews * 0.20), leads: Math.max(0, Math.floor(totalInquiries * 0.20)) },
      { name: 'Week 3', views: Math.floor(totalViews * 0.18), leads: Math.max(0, Math.floor(totalInquiries * 0.18)) },
      { name: 'Week 4', views: Math.floor(totalViews * 0.25), leads: Math.max(0, Math.floor(totalInquiries * 0.25)) },
      { name: 'Week 5', views: totalViews - Math.floor(totalViews * 0.73), leads: totalInquiries - Math.floor(totalInquiries * 0.78) },
    ].map(item => ({
      ...item,
      // Guard against negative remainders
      views: Math.max(0, item.views),
      leads: Math.max(0, item.leads)
    }));

    return NextResponse.json({
      status: 'success',
      data: {
        stats: {
          totalListings: properties.length,
          activeListings,
          draftListings,
          archivedListings,
          totalViews,
          totalSaves,
          totalInquiries,
          newInquiries,
        },
        viewsTimeline: mockTimeline,
      },
    });
  } catch (err: unknown) {
    console.error('[GET /api/analytics/agent]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
