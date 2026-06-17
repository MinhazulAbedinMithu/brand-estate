import * as React from "react";
import { Metadata } from "next";
import { BlogDetailClient } from "./blog-detail-client";
import { mockBlogPosts } from "@/src/mocks/blogPostsMock";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.seo.title || post.title,
    description: post.seo.metaDescription || post.excerpt,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title || post.title,
      description: post.seo.metaDescription || post.excerpt,
      type: post.seo.ogType || "article",
      images: [
        {
          url: post.seo.ogImage || post.coverImage,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
