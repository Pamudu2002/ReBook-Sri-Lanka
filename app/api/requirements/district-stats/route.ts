import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Aggregate requirements by district
    const stats = await Requirement.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'open', 'in-progress', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$district',
          total: { $sum: 1 },
          open: {
            $sum: {
              $cond: [
                { $in: ['$status', ['approved', 'open']] },
                1,
                0
              ]
            }
          },
          inProgress: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'in-progress'] },
                1,
                0
              ]
            }
          },
          completed: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          district: '$_id',
          total: 1,
          open: 1,
          inProgress: 1,
          completed: 1
        }
      },
      {
        $sort: { district: 1 }
      }
    ]);

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error('Fetch district stats error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch district statistics' },
      { status: 500 }
    );
  }
}
