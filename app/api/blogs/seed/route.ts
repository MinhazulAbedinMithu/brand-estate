import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models/user.model';
import { BlogPost } from '@/lib/db/models/blog-post.model';
import { mockBlogPosts } from '@/src/mocks/blogPostsMock';

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

    // ── 1. Create or Find Authors ─────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('BlogPassword123!', 12);
    
    // Define seed authors metadata
    const seedAuthors = [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@brandestate.com',
        role: 'admin' as const,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        phone: '1-800-555-0199',
        bio: 'Sarah has over a decade of experience covering residential real estate trends and providing practical advice for navigating competitive housing markets.',
      },
      {
        name: 'Aisha Al Mansoori',
        email: 'aisha.mansoori@brandestate.com',
        role: 'agent' as const,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        phone: '971-50-555-0122',
        bio: 'Aisha coordinates staging, photography, and high-end positioning for premium properties throughout Dubai and Europe.',
      },
      {
        name: 'Kenji Nakamura',
        email: 'kenji.nakamura@brandestate.com',
        role: 'agent' as const,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
        phone: '81-3-5555-0144',
        bio: 'Kenji specializes in macroeconomic real estate analysis, advising institutions and private investors on multi-family and commercial asset allocations.',
      },
    ];

    const authorMap: Record<string, string> = {}; // Name (lowercase) -> MongoDB ObjectId string

    for (const author of seedAuthors) {
      let user = await User.findOne({ email: author.email });

      if (!user) {
        user = await User.create({
          name: author.name,
          email: author.email,
          password: passwordHash,
          role: author.role,
          status: 'active',
          isVerified: true,
          avatar: author.avatar,
          phone: author.phone,
          legalDocs: {
            licenseNumber: 'LIC-' + Math.floor(100000 + Math.random() * 900000),
            agencyName: 'Brand Estate Corporate',
            documentUrl: author.avatar,
            submittedAt: new Date(),
          },
        });
      } else {
        user.role = author.role;
        user.status = 'active';
        user.isVerified = true;
        await user.save();
      }

      authorMap[author.name.toLowerCase()] = (user._id as { toString(): string }).toString();
    }

    // ── 2. Seed Blog Posts ───────────────────────────────────────────────────
    let seededCount = 0;

    for (const mockPost of mockBlogPosts) {
      // Check if duplicate slug already exists (if not in force mode)
      const existingPost = await BlogPost.findOne({ slug: mockPost.slug });
      if (existingPost && !force) {
        continue;
      }

      // Map author to seeded user
      const dbAuthorId = authorMap[mockPost.author.name.toLowerCase()] || authorMap['sarah jenkins'];
      
      const newPostData = {
        title: mockPost.title,
        slug: mockPost.slug,
        content: mockPost.content,
        excerpt: mockPost.excerpt,
        coverImage: mockPost.coverImage,
        category: mockPost.category,
        tags: mockPost.tags || [],
        author: {
          name: mockPost.author.name,
          avatar: mockPost.author.avatar,
          role: mockPost.author.role,
          bio: mockPost.author.bio || '',
        },
        authorId: dbAuthorId,
        authorRole: mockPost.authorRole || (mockPost.author.role.toLowerCase().includes('editor') ? 'admin' : 'agent'),
        isFeatured: mockPost.isFeatured || false,
        readTimeMinutes: mockPost.readTimeMinutes || 5,
        status: mockPost.status || 'published',
        rejectionReason: mockPost.rejectionReason || '',
        reactions: mockPost.reactions || {
          '🔥': Math.floor(Math.random() * 30),
          '❤️': Math.floor(Math.random() * 40),
          '👏': Math.floor(Math.random() * 25),
          '💡': Math.floor(Math.random() * 15),
          '😮': Math.floor(Math.random() * 10),
          '🚀': Math.floor(Math.random() * 20),
        },
        seo: {
          title: mockPost.seo.title || mockPost.title,
          metaDescription: mockPost.seo.metaDescription || mockPost.excerpt,
          keywords: mockPost.seo.keywords || [],
          ogImage: mockPost.seo.ogImage || mockPost.coverImage,
          ogType: mockPost.seo.ogType || 'article',
          canonicalUrl: mockPost.seo.canonicalUrl || '',
          ogTitle: mockPost.seo.ogTitle || '',
          ogDescription: mockPost.seo.ogDescription || '',
          noIndex: mockPost.seo.noIndex || false,
        },
      };

      if (existingPost && force) {
        await BlogPost.replaceOne({ _id: existingPost._id }, newPostData);
      } else {
        await BlogPost.create(newPostData);
      }
      seededCount++;
    }

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
