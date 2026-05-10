import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SavedFilter from '@/lib/models/SavedFilter';
import { processFilterQuery } from '@/lib/filters/query';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const filters = await SavedFilter.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: filters });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const rawQuery = typeof body.query === 'string' ? body.query : '';

    const processed = processFilterQuery(rawQuery);
    if (!processed) {
      return NextResponse.json(
        { success: false, error: 'Malformed or oversized query' },
        { status: 400 },
      );
    }

    const filter = await SavedFilter.create({
      userId: session.user.id,
      name: body.name,
      query: processed.canonical,
      filters: processed.filters,
    });

    return NextResponse.json({ success: true, data: filter }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
