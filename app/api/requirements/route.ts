import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      studentName,
      age,
      school,
      grade,
      address,
      district,
      contactNumber,
      guardianName,
      guardianContact,
      items,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!studentName || !age || !school || !grade || !address || !district || !contactNumber || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create new requirement
    const requirement = await Requirement.create({
      studentName,
      age,
      school,
      grade,
      address,
      district,
      contactNumber,
      guardianName,
      guardianContact,
      items,
      additionalNotes,
      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Requirement submitted successfully! It will be reviewed by our team.',
        requirement: {
          id: requirement._id,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Requirement submission error:', error);
    return NextResponse.json(
      { message: error.message || 'Submission failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: any = {};
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['approved', 'open', 'in-progress', 'completed'] }; // Show all public-facing requirements
    }

    const requirements = await Requirement.find(query)
      .sort({ submittedAt: -1 })
      .limit(100);

    return NextResponse.json({ requirements });
  } catch (error: any) {
    console.error('Fetch requirements error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch requirements' },
      { status: 500 }
    );
  }
}
