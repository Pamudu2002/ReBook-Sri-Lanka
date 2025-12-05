import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get pagination and filter parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const statusFilter = searchParams.get('status') || 'all';
    const districtFilter = searchParams.get('district') || 'all';
    const skip = (page - 1) * limit;
    
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
    
    // Build query based on filters
    const query: any = {
      status: { $in: ['approved', 'open', 'in-progress', 'completed'] }
    };
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'open') {
        query.status = { $in: ['approved', 'open'] };
      } else {
        query.status = statusFilter;
      }
    }
    
    // Apply district filter
    if (districtFilter !== 'all') {
      query.district = districtFilter;
    }
    
    // Get total count for pagination
    const totalCount = await Requirement.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Fetch paginated requirements
    let requirements;
    
    if (isDonor) {
      // For donors, include all fields
      requirements = await Requirement.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    } else {
      // For public, exclude contact details
      requirements = await Requirement.find(query)
      .select('-address -contactNumber -guardianName -guardianContact')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    }

    return NextResponse.json({ 
      requirements,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      }
    });
  } catch (error: any) {
    console.error('Fetch requirements error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch requirements' },
      { status: 500 }
    );
  }
}
