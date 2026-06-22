import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BlogPost } from '@/lib/db/models/blog-post.model';
import { seedBlogs } from '@/lib/db/seed-blogs-helper';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      await BlogPost.deleteMany({});
    }

    const postsCount = await BlogPost.countDocuments();
    if (postsCount > 0 && !force) {
      return NextResponse.json({
        status: 'success',
        message: 'Database already seeded with blog posts. Use ?force=true to re-seed.',
        count: postsCount,
      });
    }

    const seededCount = await seedBlogs();

    return NextResponse.json({
      status: 'success',
      message: 'Blogs database seeding completed successfully.',
      seededCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error('[GET /api/blogs/seed]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message },
      { status: 500 }
    );
  }
}
