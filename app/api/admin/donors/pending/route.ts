import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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

    const donors = await Donor.find({ isVerified: false })
      .sort({ registeredAt: -1 });

    return NextResponse.json({ donors });
  } catch (error: any) {
    console.error('Fetch pending donors error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}
