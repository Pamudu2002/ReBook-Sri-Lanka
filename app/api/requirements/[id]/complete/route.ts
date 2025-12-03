import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function PATCH(
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

    const requirement = await Requirement.findById(params.id);

    if (!requirement) {
      return NextResponse.json(
        { message: 'Requirement not found' },
        { status: 404 }
      );
    }

    if (requirement.donorId?.toString() !== decoded.userId) {
      return NextResponse.json(
        { message: 'You can only complete requirements you committed to' },
        { status: 403 }
      );
    }

    if (requirement.status !== 'in-progress') {
      return NextResponse.json(
        { message: 'This requirement is not in progress' },
        { status: 400 }
      );
    }

    requirement.status = 'completed';
    requirement.fulfilledAt = new Date();
    await requirement.save();

    return NextResponse.json({
      message: 'Requirement marked as completed',
      requirement,
    });
  } catch (error: any) {
    console.error('Complete error:', error);
    return NextResponse.json(
      { message: 'Failed to complete requirement' },
      { status: 500 }
    );
  }
}
