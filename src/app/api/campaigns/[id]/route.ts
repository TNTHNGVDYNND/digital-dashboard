import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

// Helper: verify session and return the userId, or send 401
async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resolvedParams = await params;
    const campaign = await Campaign.findOne({ _id: resolvedParams.id, userId });
    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await req.json();

    // findOneAndUpdate scoped to userId — prevents cross-user edits
    const campaign = await Campaign.findOneAndUpdate({ _id: resolvedParams.id, userId }, body, {
      new: true,
      runValidators: true,
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Not found or forbidden' },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const resolvedParams = await params;

    // deleteOne scoped to userId — prevents cross-user deletes
    const result = await Campaign.deleteOne({ _id: resolvedParams.id, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Not found or forbidden' },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
