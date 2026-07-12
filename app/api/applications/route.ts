import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { Property } from '@/lib/db/models/property.model';
import { PropertyApplication } from '@/lib/db/models/application.model';
import { WalletTransaction } from '@/lib/db/models/wallet-transaction.model';
import { Notification } from '@/lib/db/models/notification.model';
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
      .populate("propertyId", "title city state price images")
      .populate("userId", "name email phone creditScore kycStatus nidStatus")
      .sort({ createdAt: -1 })
      .lean();

    // Map _id to id
    const mapped = applications.map((app: any) => ({
      ...app,
      id: app._id.toString(),
      propertyId: app.propertyId ? {
        ...app.propertyId,
        id: app.propertyId._id.toString(),
        // Support some legacy code checking city/state directly on the propertyId object
        city: app.propertyId.city,
        state: app.propertyId.state,
      } : null,
      userId: app.userId ? {
        ...app.userId,
        id: app.userId._id.toString(),
      } : null,
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

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    let body: { propertyId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { propertyId } = body;
    if (!propertyId) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Property ID is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch user & check KYC + Email status
    const user = await User.findById(sessionUser.id);
    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'User account not found.' },
        { status: 404 }
      );
    }

    const isKycVerified = user.kycStatus === 'verified' || user.nidStatus === 'verified';
    if (!isKycVerified) {
      return NextResponse.json(
        { status: 'error', error: 'VerificationRequired', message: 'Identity KYC/NID verification is required to apply.' },
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { status: 'error', error: 'VerificationRequired', message: 'Email verification is required to apply.' },
        { status: 400 }
      );
    }

    // 2. Fetch property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Property listing not found.' },
        { status: 404 }
      );
    }

    // Check if already applied
    const existing = await PropertyApplication.findOne({ propertyId: property._id, userId: user._id });
    if (existing) {
      return NextResponse.json(
        { status: 'error', error: 'AlreadyApplied', message: 'You have already applied for this property.' },
        { status: 400 }
      );
    }

    const fee = property.applicationFeeRequired && property.applicationFee ? property.applicationFee : 0;

    // 3. If fee is required, check wallet balance
    if (fee > 0) {
      const userBalance = user.walletBalance ?? 0;
      if (userBalance < fee) {
        return NextResponse.json(
          {
            status: 'error',
            error: 'InsufficientWalletBalance',
            message: `Insufficient wallet balance. This application requires a fee of $${fee.toFixed(2)}, but you only have $${userBalance.toFixed(2)}. Please deposit funds first.`
          },
          { status: 400 }
        );
      }

      // Deduct fee from applicant wallet
      user.walletBalance = userBalance - fee;
      await user.save();

      // Find property owner/agent
      const lister = await User.findById(property.ownerId);
      if (lister) {
        lister.walletBalance = (lister.walletBalance ?? 0) + fee;
        await lister.save();
      }

      // Create transaction record for applicant (debit)
      const debitTx = new WalletTransaction({
        userId: user._id,
        relatedUserId: property.ownerId,
        amount: -fee,
        fee: 0,
        type: 'transfer_send',
        status: 'completed',
        description: `Tenancy application fee paid for ${property.title}`,
      });
      await debitTx.save();

      // Create transaction record for agent/owner (credit)
      const creditTx = new WalletTransaction({
        userId: property.ownerId,
        relatedUserId: user._id,
        amount: fee,
        fee: 0,
        type: 'transfer_receive',
        status: 'completed',
        description: `Received tenancy application fee from ${user.name} for ${property.title}`,
      });
      await creditTx.save();
    }

    // 4. Create property application record
    const application = new PropertyApplication({
      propertyId: property._id,
      propertyTitle: property.title,
      propertyImage: property.images?.[0] || '',
      userId: user._id,
      userName: user.name,
      agentOwnerId: property.ownerId,
      applicationFeePaid: fee,
      status: 'pending',
      paymentStatus: 'paid',
      submittedAt: new Date(),
    });
    await application.save();

    // 5. Create notifications
    // Notify applicant
    const tenantNotification = new Notification({
      userId: user._id,
      title: 'Application Submitted',
      message: `Your tenancy application for ${property.title} was submitted successfully.${fee > 0 ? ` Paid application fee of $${fee.toFixed(2)} from wallet.` : ""}`,
      type: 'application_status',
    });
    await tenantNotification.save();

    // Notify agent/owner
    const agentNotification = new Notification({
      userId: property.ownerId,
      title: 'New Tenancy Application',
      message: `You received a new tenancy application for "${property.title}" from ${user.name}.`,
      type: 'application_status',
    });
    await agentNotification.save();

    return NextResponse.json(
      { status: 'success', data: application },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Submit application error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
