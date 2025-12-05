import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('Reset token received:', token);
    console.log('Token length:', token.length);
    console.log('Current time:', Date.now());

    // Find donor with token (check without expiry first)
    const donorWithToken = await Donor.findOne({
      resetPasswordToken: token
    });
    
    console.log('Donor with token found:', donorWithToken ? 'Yes' : 'No');
    if (donorWithToken) {
      console.log('Token expiry in DB:', donorWithToken.resetPasswordExpiry);
      console.log('Token expired?', donorWithToken.resetPasswordExpiry ? new Date(donorWithToken.resetPasswordExpiry).getTime() < Date.now() : 'No expiry');
    }

    // Find donor with token and check expiry
    const donor = await Donor.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() } // Use Date object instead of timestamp
    }).select('+password');

    console.log('Donor found:', donor ? 'Yes' : 'No');

    // Debug: Check if token exists at all
    if (!donor) {
      const anyDonorWithToken = await Donor.findOne({ resetPasswordToken: { $exists: true } });
      console.log('Any donor has resetPasswordToken?', anyDonorWithToken ? 'Yes' : 'No');
      if (anyDonorWithToken) {
        console.log('Sample token in DB:', anyDonorWithToken.resetPasswordToken);
        console.log('Sample token length:', anyDonorWithToken.resetPasswordToken?.length);
        console.log('Sample expiry:', anyDonorWithToken.resetPasswordExpiry);
      }
      
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token using findByIdAndUpdate
    await Donor.findByIdAndUpdate(
      donor._id,
      {
        password: hashedPassword,
        $unset: { resetPasswordToken: '', resetPasswordExpiry: '' }
      },
      { new: true }
    );

    return NextResponse.json(
      { 
        message: 'Password reset successfully! You can now login with your new password.',
        success: true 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
