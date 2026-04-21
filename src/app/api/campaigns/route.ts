import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Campaign from '@/lib/models/Campaign';

export async function GET() {
  try {
    await dbConnect();
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const campaign = await Campaign.create(body);
    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
