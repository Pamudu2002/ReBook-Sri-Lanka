import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify donor
    const donor = await Donor.findByIdAndUpdate(
      params.id,
      { isVerified: true },
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpiry');

    if (!donor) {
      return NextResponse.json(
        { message: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      donor,
    });
  } catch (error) {
    console.error('Error verifying donor:', error);
    return NextResponse.json(
      { message: 'Failed to verify donor' },
      { status: 500 }
    );
  }
}
