import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';
import Admin from '@/models/Admin';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
      inProgressRequirements,
      completedRequirements,
      rejectedRequirements,
      totalDonors,
      verifiedDonors,
      pendingDonors,
      emailVerifiedDonors,
      totalAdmins,
    ] = await Promise.all([
      Requirement.countDocuments(),
      Requirement.countDocuments({ status: 'pending' }),
      Requirement.countDocuments({ status: 'approved' }),
      Requirement.countDocuments({ status: 'in-progress' }),
      Requirement.countDocuments({ status: 'completed' }),
      Requirement.countDocuments({ status: 'rejected' }),
      Donor.countDocuments(),
      Donor.countDocuments({ isVerified: true }),
      Donor.countDocuments({ isVerified: false }),
      Donor.countDocuments({ isEmailVerified: true }),
      Admin.countDocuments(),
    ]);

    return NextResponse.json({
      statistics: {
        requirements: {
          total: totalRequirements,
          pending: pendingRequirements,
          approved: approvedRequirements,
          'in-progress': inProgressRequirements,
          completed: completedRequirements,
          rejected: rejectedRequirements,
        },
        donors: {
          total: totalDonors,
          verified: verifiedDonors,
          pending: pendingDonors,
          emailVerified: emailVerifiedDonors,
        },
        admins: {
          total: totalAdmins,
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
