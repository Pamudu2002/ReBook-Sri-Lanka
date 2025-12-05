import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import PendingDonor from '@/models/PendingDonor';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, otp } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
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

    // Check if OTP has expired
    if (new Date() > pendingDonor.otpExpiry) {
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (pendingDonor.emailOTP !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // Check if email already exists in Donor collection (edge case)
    const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
    if (existingDonor) {
      // Clean up pending registration
      await PendingDonor.findByIdAndDelete(pendingDonor._id);
      return NextResponse.json(
        { message: 'Email already registered. Please login.' },
        { status: 400 }
      );
    }

    // Create actual donor account
    await Donor.create({
      name: pendingDonor.name,
      email: pendingDonor.email,
      password: pendingDonor.password, // Already hashed by PendingDonor pre-save hook
      phone: pendingDonor.phone,
      address: pendingDonor.address,
      district: pendingDonor.district,
      organization: pendingDonor.organization,
      isVerified: false, // Admin still needs to verify
      isEmailVerified: true, // Email is now verified
      registeredAt: new Date(),
    });

    // Delete pending registration
    await PendingDonor.findByIdAndDelete(pendingDonor._id);

    return NextResponse.json(
      {
        message: 'Email verified successfully! Your account is now pending admin approval.',
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
