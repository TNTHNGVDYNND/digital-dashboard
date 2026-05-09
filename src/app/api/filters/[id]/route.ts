import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SavedFilter from '@/lib/models/SavedFilter';
import type { FilterClause } from '@/types/filters';
import { processFilterQuery } from '@/lib/filters/query';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await req.json();

    const updateData: { name?: string; query?: string; filters?: FilterClause[] } = {};

    if (typeof body.name === 'string') {
      updateData.name = body.name;
    }

    if (typeof body.query === 'string') {
      const processed = processFilterQuery(body.query);
      if (!processed) {
        return NextResponse.json({ success: false, error: 'Malformed or oversized query' }, { status: 400 });
      }
      updateData.query = processed.canonical;
      updateData.filters = processed.filters;
    }

    const filter = await SavedFilter.findOneAndUpdate(
      { _id: resolvedParams.id, userId: session.user.id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!filter) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: filter });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resolvedParams = await params;

    const result = await SavedFilter.deleteOne({ _id: resolvedParams.id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
