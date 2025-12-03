import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalRequirements,
      pendingRequirements,
      approvedRequirements,
      fulfilledRequirements,
      totalDonors,
      verifiedDonors,
      pendingDonors,
    ] = await Promise.all([
      Requirement.countDocuments(),
      Requirement.countDocuments({ status: 'pending' }),
      Requirement.countDocuments({ status: 'approved' }),
      Requirement.countDocuments({ status: 'fulfilled' }),
      Donor.countDocuments(),
      Donor.countDocuments({ isVerified: true }),
      Donor.countDocuments({ isVerified: false }),
    ]);

    return NextResponse.json({
      statistics: {
        requirements: {
          total: totalRequirements,
          pending: pendingRequirements,
          approved: approvedRequirements,
          fulfilled: fulfilledRequirements,
        },
        donors: {
          total: totalDonors,
          verified: verifiedDonors,
          pending: pendingDonors,
        },
      },
    });
  } catch (error: any) {
    console.error('Fetch statistics error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
