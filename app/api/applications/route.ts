import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { PropertyApplication } from '@/lib/db/models/application.model';
import { getSessionUser } from '@/lib/auth/get-user';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    await connectDB();

    let query = {};
    if (session.role === 'auth_user') {
      query = { userId: session.id };
    } else if (session.role === 'agent' || session.role === 'owner') {
      query = { agentOwnerId: session.id };
    } else if (session.role === 'admin' || session.role === 'super_admin') {
      query = {}; // Admins can view all applications
    } else {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Invalid role access.' },
        { status: 403 }
      );
    }

    const applications = await PropertyApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Map _id to id
    const mapped = applications.map((app: any) => ({
      ...app,
      id: app._id.toString(),
      propertyId: app.propertyId.toString(),
      userId: app.userId.toString(),
      agentOwnerId: app.agentOwnerId.toString(),
    }));

    return NextResponse.json(
      { status: 'success', data: mapped },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Fetch applications error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
