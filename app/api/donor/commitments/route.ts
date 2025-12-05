import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
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
    if (!decoded || decoded.role !== 'donor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch requirements committed by this donor
    const requirements = await Requirement.find({
      donorId: decoded.userId,
      status: { $in: ['in-progress', 'completed'] }
    })
      .sort({ submittedAt: -1 });

    return NextResponse.json({ requirements });
  } catch (error: any) {
    console.error('Fetch commitments error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch commitments' },
      { status: 500 }
    );
  }
}
