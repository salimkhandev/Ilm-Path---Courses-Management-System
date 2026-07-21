import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import { getPresignedGetUrl } from '@/lib/r2';
import mongoose from 'mongoose';

// List payments with their users
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const payments = await Payment.find().sort({ submittedAt: -1 }).lean();

  const updatedPayments = await Promise.all(
    payments.map(async (p) => {
      let screenshotUrl = null;
      try {
        screenshotUrl = p.screenshotKey ? await getPresignedGetUrl(p.screenshotKey, 3600) : null;
      } catch (err) {
        console.error('Failed to get presigned URL for', p.screenshotKey, err);
      }
      return {
        ...p,
        id: p._id.toString(),
        userId: p.userId.toString(),
        screenshotUrl,
      };
    })
  );

  return NextResponse.json(updatedPayments);
}

// Approve or Reject a payment
export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paymentId, status, adminNote } = await req.json();

  if (!paymentId || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 });
  }

  await connectDB();

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
  }

  payment.status = status;
  payment.adminNote = adminNote ?? '';
  payment.reviewedAt = new Date();
  payment.reviewedBy = new mongoose.Types.ObjectId(token.id);
  await payment.save();

  if (status === 'approved') {
    // Grant access for 1 year
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    await User.findByIdAndUpdate(payment.userId, {
      status: 'paid',
      accessExpiresAt: expiry,
    });
  } else {
    // Rejected
    await User.findByIdAndUpdate(payment.userId, {
      status: 'rejected',
    });
  }

  return NextResponse.json({ success: true });
}
