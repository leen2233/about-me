import { NextResponse } from 'next/server';
import { projectDb } from '@/lib/db';

export async function GET() {
  try {
    const projects = projectDb.getAll();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
