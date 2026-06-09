import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Calendar, Clock, ChevronLeft, ArrowRight, User } from "lucide-react";
import { mockBlogPosts, generateBlogPostJsonLd } from "@/src/mocks/blogPostsMock";
import { BlogCard } from "@/components/shared/blog-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { cn } from "@/lib/utils";

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
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Generate related posts (same category first, up to 3, excluding current)
  let relatedPosts = mockBlogPosts.filter((p) => p.id !== post.id && p.category === post.category);
  if (relatedPosts.length < 3) {
    const additional = mockBlogPosts.filter((p) => p.id !== post.id && p.category !== post.category);
    relatedPosts = [...relatedPosts, ...additional].slice(0, 3);
  } else {
    relatedPosts = relatedPosts.slice(0, 3);
  }

  const jsonLd = generateBlogPostJsonLd(post);

  // Format published date
  const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Structured SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-body text-text-muted hover:text-accent-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Insights
          </Link>
        </div>

        {/* SECTION A: Article Header */}
        <div className="space-y-4 max-w-4xl">
          <span className="inline-flex bg-accent-primary/10 text-accent-primary border border-accent-primary/15 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider capitalize">
            {post.category.replace("-", " ")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Quick specs horizontal row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-text-secondary font-medium pt-2 border-t border-border-default/45">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent-primary" />
              Published: {publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-primary" />
              {post.readTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* SECTION B: Large Cover Image */}
        <div className="relative aspect-21/9 w-full rounded-3xl overflow-hidden border border-border-default/50 shadow-md">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* SECTION C: Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start pt-4">

          {/* Left Column (2/3 width) - Rich Content Reader */}
          <div className="lg:col-span-2 space-y-6">
            <article className="prose dark:prose-invert max-w-none">
              {renderMarkdown(post.content)}
            </article>

            {/* Tags row */}
            <div className="pt-6 border-t border-border-default/45 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-bg-elevated/80 border border-border-default/60 text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column / Sticky Sidebar (1/3 width) */}
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* Author Profile Card */}
            <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 shadow-sm space-y-4">
              <h4 className="font-body text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-default pb-3">
                About the Author
              </h4>
              <div className="flex items-center gap-3.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full border border-border-default object-cover"
                />
                <div>
                  <h5 className="text-sm font-bold text-text-primary">{post.author.name}</h5>
                  <span className="text-[10px] text-accent-primary font-bold uppercase tracking-wider block mt-0.5">{post.author.role}</span>
                </div>
              </div>
              {post.author.bio && (
                <p className="text-xs text-text-secondary leading-relaxed font-body font-medium">
                  {post.author.bio}
                </p>
              )}
            </div>

            {/* Social Share Buttons */}
            <ShareButtons title={post.title} slug={post.slug} />

            {/* Newsletter Subscription Card */}
            <NewsletterForm />

          </div>

        </div>

        {/* SECTION D: Recommended/Related Articles (Full Width grid) */}
        <div className="mt-16 pt-16 border-t border-border-default/45 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
              Recommended for You
            </h3>
            <Link
              href="/blogs"
              className="group flex items-center gap-1.5 text-xs font-extrabold text-accent-primary hover:text-accent-primary-hov transition-colors"
            >
              All Articles
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <BlogCard key={rPost.id} post={rPost} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Markdown Rendering Helpers ──────────────────────────────────────────────

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: string | number) => {
    if (currentList) {
      if (currentList.type === "ul") {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-text-secondary font-body space-y-2 mb-6">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-text-secondary font-body space-y-2 mb-6">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = (key: string | number) => {
    if (inTable && tableRows.length > 0) {
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator row
      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto rounded-xl border border-border-default bg-bg-surface/50 p-1 mb-6 shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border-default font-body font-bold text-text-primary">
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-semibold">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border-default/50 last:border-b-0 hover:bg-bg-alt/30 transition-colors font-body text-text-secondary">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3">{parseInlineMarkdown(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Table Row parsing
    if (line.startsWith("|")) {
      flushList(i);
      inTable = true;
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else {
      flushTable(i);
    }

    // Unordered list item
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const text = line.substring(2);
      if (!currentList || currentList.type !== "ul") {
        flushList(i);
        currentList = { type: "ul", items: [text] };
      } else {
        currentList.items.push(text);
      }
      continue;
    }

    // Ordered list item
    const matchOl = line.match(/^(\d+)\.\s(.*)/);
    if (matchOl) {
      const text = matchOl[2];
      if (!currentList || currentList.type !== "ol") {
        flushList(i);
        currentList = { type: "ol", items: [text] };
      } else {
        currentList.items.push(text);
      }
      continue;
    }

    // Non-list line, flush list if any
    flushList(i);

    // Empty line
    if (!line) {
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-text-primary mt-10 mb-5 border-b border-border-default pb-3">
          {line.substring(3)}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-text-primary mt-8 mb-4">
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (line === "---") {
      elements.push(<hr key={i} className="border-t border-border-default my-6" />);
      continue;
    }

    // Callout box: > [!IMPORTANT] or > [!TIP] or > [!WARNING] or > [!NOTE]
    if (line.startsWith("> [!")) {
      // Gather lines inside the blockquote
      let type: "IMPORTANT" | "TIP" | "WARNING" | "NOTE" = "NOTE";
      if (line.includes("IMPORTANT")) type = "IMPORTANT";
      else if (line.includes("TIP")) type = "TIP";
      else if (line.includes("WARNING")) type = "WARNING";

      const contentLines: string[] = [];
      i++; // Move past header line
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const text = lines[i].trim();
        // Remove leading > and trim
        const cleanContent = text.replace(/^>\s?/, "");
        contentLines.push(cleanContent);
        i++;
      }
      i--; // Step back to balance loop

      const blockContent = contentLines.join(" ");

      let borderClass = "border-l-accent-primary border-y-border-default/50 border-r-border-default/50 bg-accent-primary/5 dark:bg-accent-primary/10 text-text-secondary";
      let titleColor = "text-accent-primary";
      if (type === "IMPORTANT") {
        borderClass = "border-l-state-error border-y-border-default/50 border-r-border-default/50 bg-state-error/5 dark:bg-state-error/10 text-text-secondary";
        titleColor = "text-state-error";
      } else if (type === "TIP") {
        borderClass = "border-l-state-success border-y-border-default/50 border-r-border-default/50 bg-state-success/5 dark:bg-state-success/10 text-text-secondary";
        titleColor = "text-state-success";
      } else if (type === "WARNING") {
        borderClass = "border-l-state-warning border-y-border-default/50 border-r-border-default/50 bg-state-warning/5 dark:bg-state-warning/10 text-text-secondary";
        titleColor = "text-state-warning";
      }

      elements.push(
        <div key={i} className={cn("p-5 rounded-2xl border-l-4 border-y border-r mb-6 shadow-sm", borderClass)}>
          <span className={cn("text-xs font-bold font-body uppercase tracking-wider block mb-1.5", titleColor)}>
            {type}
          </span>
          <p className="text-sm sm:text-base font-body font-medium leading-relaxed">
            {parseInlineMarkdown(blockContent)}
          </p>
        </div>
      );
      continue;
    }

    // Standard Paragraph
    elements.push(
      <p key={i} className="text-sm sm:text-base text-text-secondary leading-relaxed font-body mb-6">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  // Final flushes
  flushList("final");
  flushTable("final");

  return elements;
}

// Regex helper to handle **bold** and [text](link) and math equations
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  // Let's replace raw math symbols if found (quick cleanup for yield expressions)
  currentText = currentText
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\%/g, "%")
    .replace(/\\times/g, "×")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 / $2")
    .replace(/\$\$/g, ""); // strip $$ block markers

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf("**");
    const linkIndex = currentText.indexOf("[");

    if (boldIndex === -1 && linkIndex === -1) {
      parts.push(<span key={key++}>{currentText}</span>);
      break;
    }

    // Bold is first or link is not found
    if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
      if (boldIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, boldIndex)}</span>);
      }
      const closeBoldIndex = currentText.indexOf("**", boldIndex + 2);
      if (closeBoldIndex !== -1) {
        const boldText = currentText.substring(boldIndex + 2, closeBoldIndex);
        parts.push(<strong key={key++} className="font-extrabold text-text-primary">{boldText}</strong>);
        currentText = currentText.substring(closeBoldIndex + 2);
      } else {
        parts.push(<span key={key++}>**</span>);
        currentText = currentText.substring(boldIndex + 2);
      }
    }
    // Link is first
    else {
      if (linkIndex > 0) {
        parts.push(<span key={key++}>{currentText.substring(0, linkIndex)}</span>);
      }
      const closeSquareIndex = currentText.indexOf("]", linkIndex);
      const openParenIndex = currentText.indexOf("(", closeSquareIndex);
      const closeParenIndex = currentText.indexOf(")", openParenIndex);

      if (closeSquareIndex !== -1 && openParenIndex === closeSquareIndex + 1 && closeParenIndex !== -1) {
        const linkText = currentText.substring(linkIndex + 1, closeSquareIndex);
        const href = currentText.substring(openParenIndex + 1, closeParenIndex);

        const isAnchor = href.startsWith("#") || href.startsWith("/") || href.startsWith("http");
        if (isAnchor) {
          parts.push(
            <Link key={key++} href={href} className="text-accent-primary hover:underline font-semibold transition-colors duration-200">
              {linkText}
            </Link>
          );
        } else {
          parts.push(<span key={key++}>{linkText}</span>);
        }
        currentText = currentText.substring(closeParenIndex + 1);
      } else {
        parts.push(<span key={key++}>[</span>);
        currentText = currentText.substring(linkIndex + 1);
      }
    }
  }

  return parts;
}
