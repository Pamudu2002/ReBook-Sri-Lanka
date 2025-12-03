import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find donor with password field
    const donor = await Donor.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!donor) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if donor is verified
    if (!donor.isVerified) {
      return NextResponse.json(
        { message: 'Your account is pending admin verification' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await donor.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(donor._id.toString(), 'donor');

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        isVerified: donor.isVerified,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
