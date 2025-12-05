import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';
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

    const donor = await Donor.findByIdAndUpdate(
      params.id,
      {
        isVerified: true,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!donor) {
      return NextResponse.json(
        { message: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Donor verified successfully',
      donor,
    });
  } catch (error: any) {
    console.error('Verify donor error:', error);
    return NextResponse.json(
      { message: 'Failed to verify donor' },
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

    const donor = await Donor.findByIdAndDelete(params.id);

    if (!donor) {
      return NextResponse.json(
        { message: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Donor deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete donor error:', error);
    return NextResponse.json(
      { message: 'Failed to delete donor' },
      { status: 500 }
    );
  }
}
