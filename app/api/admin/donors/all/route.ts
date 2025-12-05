import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Fetch all donors (not just pending)
    const donors = await Donor.find({})
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .sort({ registeredAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      donors,
    });
  } catch (error) {
    console.error('Error fetching all donors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}
