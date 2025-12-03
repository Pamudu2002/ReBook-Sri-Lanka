import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    let isDonor = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.role === 'donor') {
          // Verify donor exists and is verified (token uses 'userId' not 'id')
          const donor = await Donor.findById(decoded.userId);
          if (donor && donor.isVerified) {
            isDonor = true;
          }
        }
      } catch (err) {
        // Invalid token, treat as public
      }
    }
    
    // Fetch all approved/open requirements
    let requirements;
    
    if (isDonor) {
      // For donors, include all fields
      requirements = await Requirement.find({
        status: { $in: ['approved', 'open', 'in-progress', 'completed'] }
      })
      .sort({ submittedAt: -1 })
      .limit(200)
      .lean();
    } else {
      // For public, exclude contact details
      requirements = await Requirement.find({
        status: { $in: ['approved', 'open', 'in-progress', 'completed'] }
      })
      .select('-address -contactNumber -guardianName -guardianContact')
      .sort({ submittedAt: -1 })
      .limit(200)
      .lean();
    }

    return NextResponse.json({ requirements });
  } catch (error: any) {
    console.error('Fetch requirements error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch requirements' },
      { status: 500 }
    );
  }
}
