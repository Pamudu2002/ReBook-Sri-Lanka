import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Fetch all approved/open requirements with status approved, open, in-progress, or completed
    const requirements = await Requirement.find({
      status: { $in: ['approved', 'open', 'in-progress', 'completed'] }
    })
      .select('-address -contactNumber -guardianName -guardianContact')
      .sort({ submittedAt: -1 })
      .limit(200);

    return NextResponse.json({ requirements });
  } catch (error: any) {
    console.error('Fetch public requirements error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch requirements' },
      { status: 500 }
    );
  }
}
