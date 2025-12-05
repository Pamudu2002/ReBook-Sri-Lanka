import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import PendingDonor from '@/models/PendingDonor';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, phone, address, district, organization } = body;

    // Validate required fields
    if (!name || !email || !password || !phone || !address || !district) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if donor already exists in main Donor collection
    const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
    if (existingDonor) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if already in pending registrations
    const existingPending = await PendingDonor.findOne({ email: email.toLowerCase() });
    if (existingPending) {
      // Delete old pending registration
      await PendingDonor.findByIdAndDelete(existingPending._id);
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create pending donor registration
    const pendingDonor = await PendingDonor.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      address,
      district,
      organization,
      emailOTP: otp,
      otpExpiry,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email.toLowerCase(), otp, name);

    if (!emailSent) {
      // If email fails, delete the pending registration and return error
      await PendingDonor.findByIdAndDelete(pendingDonor._id);
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email for the verification code.',
        donor: {
          id: pendingDonor._id,
          email: pendingDonor.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
