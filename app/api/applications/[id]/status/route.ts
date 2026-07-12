import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { PropertyApplication } from '@/lib/db/models/application.model';
import { WalletTransaction } from '@/lib/db/models/wallet-transaction.model';
import { Notification } from '@/lib/db/models/notification.model';
import { getSessionUser } from '@/lib/auth/get-user';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    if (session.role === 'auth_user') {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'Only agents, owners, or admins can update application status.' },
        { status: 403 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { status, feedback, scheduleDate, scheduleTime } = body as { 
      status?: string; 
      feedback?: string;
      scheduleDate?: string;
      scheduleTime?: string;
    };

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Status must be approved or rejected.' },
        { status: 400 }
      );
    }

    if (status === 'approved' && (!scheduleDate || !scheduleTime)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Meeting schedule date and time are required for approval.' },
        { status: 400 }
      );
    }

    await connectDB();

    const application = await PropertyApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { status: 'error', error: 'NotFound', message: 'Application not found.' },
        { status: 404 }
      );
    }

    // Verify ownership of listing (except admin)
    if (session.role !== 'admin' && session.role !== 'super_admin' && application.agentOwnerId.toString() !== session.id) {
      return NextResponse.json(
        { status: 'error', error: 'Forbidden', message: 'You do not have permission to manage this application.' },
        { status: 403 }
      );
    }

    if (application.status !== 'pending') {
      return NextResponse.json(
        { status: 'error', error: 'InvalidState', message: `Application is already ${application.status}.` },
        { status: 400 }
      );
    }

    application.processedAt = new Date();
    if (feedback) {
      application.feedback = feedback;
    }

    if (status === 'approved') {
      application.status = 'approved';
      application.scheduleDate = scheduleDate;
      application.scheduleTime = scheduleTime;
      
      // Parse scheduled timestamp
      try {
        application.scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
      } catch (err) {
        console.warn("Failed to parse scheduled date time:", err);
      }

      await application.save();

      // Create schedule notification for the tenant
      const tenantNotification = new Notification({
        userId: application.userId,
        title: 'Application Approved & Visit Scheduled',
        message: `Your tenancy application for "${application.propertyTitle}" has been approved! A meetup visit is scheduled for ${scheduleDate} at ${scheduleTime}.`,
        type: 'application_schedule',
      });
      await tenantNotification.save();

    } else if (status === 'rejected') {
      application.status = 'rejected';
      application.paymentStatus = 'refunded';

      // Wallet Refund Logic
      const fee = application.applicationFeePaid;
      if (fee > 0) {
        const applicant = await User.findById(application.userId);
        const lister = await User.findById(application.agentOwnerId);

        if (applicant) {
          applicant.walletBalance = (applicant.walletBalance ?? 0) + fee;
          await applicant.save();
        }

        if (lister) {
          lister.walletBalance = Math.max(0, (lister.walletBalance ?? 0) - fee);
          await lister.save();
        }

        // Create refund transaction logs
        // Refund receive for tenant (credit)
        const refundReceiveTx = new WalletTransaction({
          userId: application.userId,
          relatedUserId: application.agentOwnerId,
          amount: fee,
          fee: 0,
          type: 'refund_receive',
          status: 'completed',
          description: `Refunded application fee for rejected application: ${application.propertyTitle}`,
        });
        await refundReceiveTx.save();

        // Refund send for lister (debit)
        const refundSendTx = new WalletTransaction({
          userId: application.agentOwnerId,
          relatedUserId: application.userId,
          amount: -fee,
          fee: 0,
          type: 'refund_send',
          status: 'completed',
          description: `Refunded application fee for rejected application from ${application.userName}`,
        });
        await refundSendTx.save();
      }

      await application.save();

      // Create notification for the tenant
      const tenantNotification = new Notification({
        userId: application.userId,
        title: 'Application Rejected',
        message: `Your application for "${application.propertyTitle}" was rejected.${fee > 0 ? ` $${fee.toFixed(2)} has been refunded back to your wallet.` : ""}`,
        type: 'application_status',
      });
      await tenantNotification.save();
    }

    return NextResponse.json(
      { 
        status: 'success', 
        message: `Application has been ${status === 'rejected' ? 'rejected and refunded' : 'approved and scheduled'} successfully.`, 
        data: application 
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Update application status error:', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
