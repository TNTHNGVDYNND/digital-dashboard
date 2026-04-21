import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

/**
 * Temporary migration route to link orphaned campaigns to a user account.
 * Only authenticated users can call this to "claim" their pre-auth data.
 */
export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find all campaigns that don't have a userId yet
    const result = await Campaign.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: session.user.id } },
    );

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${result.modifiedCount} campaign(s).`,
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
