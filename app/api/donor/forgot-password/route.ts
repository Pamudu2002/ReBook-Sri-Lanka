import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import { generateResetToken, sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find donor with email
    const donor = await Donor.findOne({ 
      email: email.toLowerCase() 
    });

    // Always return success message (security best practice)
    const successMessage = 'If an account exists with this email, you will receive a password reset link shortly.';

    if (!donor) {
      return NextResponse.json(
        { message: successMessage, success: true },
        { status: 200 }
      );
    }

    // Check if email is verified
    if (!donor.isEmailVerified) {
      return NextResponse.json(
        { message: 'Please verify your email address before resetting your password.' },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    console.log('Generated token:', resetToken);
    console.log('Token length:', resetToken.length);
    console.log('Expiry time:', resetExpiry);

    // Update donor with reset token using findByIdAndUpdate
    await Donor.findByIdAndUpdate(
      donor._id,
      {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetExpiry,
      },
      { new: true }
    );

    console.log('Token saved. Donor ID:', donor._id);

    // Verify it was saved
    const verifyDonor = await Donor.findById(donor._id);
    console.log('Verification - Token in DB:', verifyDonor?.resetPasswordToken);
    console.log('Verification - Expiry in DB:', verifyDonor?.resetPasswordExpiry);

    // Send email
    const emailSent = await sendPasswordResetEmail(email.toLowerCase(), resetToken, donor.name);

    if (!emailSent) {
      // Clear token if email fails
      await Donor.findByIdAndUpdate(donor._id, {
        $unset: { resetPasswordToken: '', resetPasswordExpiry: '' }
      });
      
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: successMessage, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
