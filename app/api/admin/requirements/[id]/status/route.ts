import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
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

    const { status } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'approved', 'in-progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update requirement status
    const requirement = await Requirement.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!requirement) {
      return NextResponse.json(
        { message: 'Requirement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      requirement,
    });
  } catch (error) {
    console.error('Error updating requirement status:', error);
    return NextResponse.json(
      { message: 'Failed to update status' },
      { status: 500 }
    );
  }
}
