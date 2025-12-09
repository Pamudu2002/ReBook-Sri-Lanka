import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Requirement from '@/models/Requirement';
import Donor from '@/models/Donor';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

// Seeded PRNG function (Mulberry32)
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Fisher-Yates shuffle with seeded PRNG
function shuffleArray<T>(array: T[], seed: number) {
  const rng = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get pagination and filter parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const statusFilter = searchParams.get('status') || 'all';
    const districtFilter = searchParams.get('district') || 'all';
    
    // Use provided seed or generate new one based on current time
    const seedParam = searchParams.get('seed');
    const seed = seedParam ? parseInt(seedParam) : Date.now();

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
    
    // 1. Fetch ALL matching IDs sorted deterministically
    // We sort by _id to ensure a consistent starting point before shuffling
    const allRequirementIds = await Requirement.find(query)
      .select('_id')
      .sort({ _id: 1 })
      .lean();
      
    // 2. Shuffle the IDs using the seed
    const shuffledIds = shuffleArray(allRequirementIds.map(r => r._id), seed);
    
    // 3. Slice for current page
    const pageIds = shuffledIds.slice(skip, skip + limit);
    
    // 4. Fetch full documents for the page's IDs
    let requirementsQuery = Requirement.find({ _id: { $in: pageIds } });
    
    if (!isDonor) {
      requirementsQuery = requirementsQuery.select('-address -contactNumber -guardianName -guardianContact');
    }
    
    const fetchedRequirements = await requirementsQuery.lean();
    
    // 5. Re-order documents to match the shuffled ID order
    // (Database return order is not guaranteed to match $in order)
    const requirements = pageIds.map(id => 
      fetchedRequirements.find(req => req._id.toString() === id.toString())
    ).filter(Boolean); // Filter out any potential nulls (shouldn't happen)

    return NextResponse.json({ 
      requirements,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        seed // Return seed to client
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
