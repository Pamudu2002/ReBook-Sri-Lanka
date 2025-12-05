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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, rejectionReason } = body;

    if (action === 'approve') {
      const requirement = await Requirement.findByIdAndUpdate(
        params.id,
        {
          status: 'open',
          reviewedAt: new Date(),
        },
        { new: true }
      );

      if (!requirement) {
        return NextResponse.json(
          { message: 'Requirement not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Requirement approved successfully',
        requirement,
      });
    } else if (action === 'reject') {
      const requirement = await Requirement.findByIdAndUpdate(
        params.id,
        {
          status: 'rejected',
          reviewedAt: new Date(),
          rejectionReason,
        },
        { new: true }
      );

      if (!requirement) {
        return NextResponse.json(
          { message: 'Requirement not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Requirement rejected',
        requirement,
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Update requirement error:', error);
    return NextResponse.json(
      { message: 'Failed to update requirement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const requirement = await Requirement.findByIdAndDelete(params.id);

    if (!requirement) {
      return NextResponse.json(
        { message: 'Requirement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Requirement deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete requirement error:', error);
    return NextResponse.json(
      { message: 'Failed to delete requirement' },
      { status: 500 }
    );
  }
}
