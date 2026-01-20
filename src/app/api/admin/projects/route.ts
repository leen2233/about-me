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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, status, date, url, live, description, features, repos } = body;

    if (!id || !name || !date || !url || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, date, url, description' },
        { status: 400 }
      );
    }

    const project = projectDb.create({
      id,
      name,
      status,
      date,
      url,
      live,
      description,
      features,
      repos,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'A project with this ID already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
