import * as React from "react";
import { Metadata } from "next";
import { BlogDetailClient } from "./blog-detail-client";
import { connectDB } from "@/lib/db/mongoose";
import { BlogPost } from "@/lib/db/models/blog-post.model";
import { getBlogPostSchema } from "@/lib/seo-json-ld";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  await connectDB();
  const post = await BlogPost.findOne({ slug: slug.toLowerCase() }).lean();

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const ogImage = post.seo?.ogImage || post.coverImage;
  const ogTitle = post.seo?.ogTitle || title;
  const ogDescription = post.seo?.ogDescription || description;
  const keywords = post.seo?.keywords || [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: post.seo?.ogType || "article",
      url: `/blogs/${slug.toLowerCase()}`,
      siteName: "RealHoms",
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogPostDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;

  await connectDB();
  const post = await BlogPost.findOne({ slug: slug.toLowerCase() }).lean();
  const jsonLd = getBlogPostSchema(post);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailClient slug={slug} />
    </>
  );
}
