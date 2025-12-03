import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';

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

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email: email.toLowerCase() });
    if (existingDonor) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new donor
    const donor = await Donor.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      address,
      district,
      organization,
      isVerified: false,
    });

    return NextResponse.json(
      {
        message: 'Registration successful! Your account is pending admin verification.',
        donor: {
          id: donor._id,
          name: donor.name,
          email: donor.email,
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
