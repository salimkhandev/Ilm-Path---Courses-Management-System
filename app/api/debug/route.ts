import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Payment from '@/lib/models/Payment';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'salimkhandev12@gmail.com';

  await connectDB();
  
  const user = await User.findOne({ email }).lean();
  const payments = await Payment.find({ email }).lean();

  return NextResponse.json({
    user,
    payments
  });
}
