import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { PropertyApplication } from '@/lib/db/models/application.model';
import { getSessionUser } from '@/lib/auth/get-user';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

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

    const { status, feedback } = body as { status?: string; feedback?: string };

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { status: 'error', error: 'ValidationError', message: 'Status must be approved or rejected.' },
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

    // Handle refund if rejected and not already processed
    if (status === 'rejected' && application.status === 'pending') {
      const applicant = await User.findById(application.userId);
      if (applicant && application.applicationFeePaid > 0) {
        if (application.stripePaymentIntentId) {
          try {
            const refund = await stripe.refunds.create({
              payment_intent: application.stripePaymentIntentId,
            });
            application.stripeRefundId = refund.id;
            application.paymentStatus = 'refunded';
          } catch (refundErr: any) {
            console.error("Stripe refund failed:", refundErr);
            // Fallback to refunding the mock wallet balance if Stripe refund fails (e.g. test key limits)
            applicant.walletBalance = (applicant.walletBalance ?? 0) + application.applicationFeePaid;
            await applicant.save();
          }
        } else {
          // Fallback if paid via mock wallet
          applicant.walletBalance = (applicant.walletBalance ?? 0) + application.applicationFeePaid;
          await applicant.save();
        }
      }
      application.status = 'refunded'; // Save as refunded status to show the refund occurred
    } else {
      application.status = status as 'approved' | 'rejected' | 'refunded';
    }

    application.processedAt = new Date();
    if (feedback) {
      application.feedback = feedback;
    }

    await application.save();

    return NextResponse.json(
      { 
        status: 'success', 
        message: `Application has been ${status === 'rejected' ? 'rejected and refunded' : 'approved'} successfully.`, 
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
