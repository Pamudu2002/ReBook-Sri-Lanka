import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'donor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const donor = await Donor.findById(decoded.userId);
    
    if (!donor || !donor.isVerified) {
      return NextResponse.json(
        { message: 'Donor not verified' },
        { status: 403 }
      );
    }

    const requirement = await Requirement.findById(params.id);

    if (!requirement) {
      return NextResponse.json(
        { message: 'Requirement not found' },
        { status: 404 }
      );
    }

    if (requirement.status !== 'open' && requirement.status !== 'approved') {
      return NextResponse.json(
        { message: 'This requirement is not available' },
        { status: 400 }
      );
    }

    requirement.status = 'in-progress';
    requirement.donorId = donor._id;
    requirement.donorName = donor.name;
    await requirement.save();

    return NextResponse.json({
      message: 'Successfully committed to help this student',
      requirement,
    });
  } catch (error: any) {
    console.error('Commit error:', error);
    return NextResponse.json(
      { message: 'Failed to commit' },
      { status: 500 }
    );
  }
}
