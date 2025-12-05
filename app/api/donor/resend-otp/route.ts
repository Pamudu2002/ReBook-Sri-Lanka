import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PendingDonor from '@/models/PendingDonor';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find pending donor
    const pendingDonor = await PendingDonor.findOne({ 
      email: email.toLowerCase() 
    });

    if (!pendingDonor) {
      return NextResponse.json(
        { message: 'No pending registration found with this email' },
        { status: 404 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update pending donor with new OTP
    pendingDonor.emailOTP = otp;
    pendingDonor.otpExpiry = otpExpiry;
    await pendingDonor.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email.toLowerCase(), otp, pendingDonor.name);

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'A new verification code has been sent to your email.',
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}
