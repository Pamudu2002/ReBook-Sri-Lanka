import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const district = searchParams.get('district');
    const status = searchParams.get('status');
    const age = searchParams.get('age');
    const sortBy = searchParams.get('sortBy');

    const query: any = {};

    if (name) {
      query.studentName = { $regex: name, $options: 'i' };
    }

    if (district) {
      query.district = district;
    }

    if (status) {
      query.status = status;
    }

    if (age) {
      query.age = parseInt(age);
    }

    let sort: any = { submittedAt: -1 }; // Default sort

    if (sortBy) {
      switch (sortBy) {
        case 'oldest':
          sort = { submittedAt: 1 };
          break;
        case 'newest':
          sort = { submittedAt: -1 };
          break;
        case 'name':
          sort = { studentName: 1 };
          break;
        case 'age':
          sort = { age: 1 };
          break;
      }
    }

    // Fetch all requirements with filters and sort
    const requirements = await Requirement.find(query)
      .sort(sort)
      .lean();

    const totalCount = await Requirement.countDocuments(query);

    return NextResponse.json({
      success: true,
      requirements,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching all requirements:', error);
    return NextResponse.json(
      { message: 'Failed to fetch requirements' },
      { status: 500 }
    );
  }
}
