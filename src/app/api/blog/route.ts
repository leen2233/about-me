import { NextResponse } from 'next/server';
import { blogDb } from '@/lib/db';

export async function GET() {
  try {
    const posts = blogDb.getAllPublished();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, content, summary, published, tags } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      );
    }

    const post = blogDb.create({ slug, title, content, summary, published, tags });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
